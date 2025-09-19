from datetime import timedelta
from typing import Annotated

from app.config import settings
from app.deps import SessionDep
from app.models import Token, User, UserCreate, UserPublic
from app.security import create_access_token, get_password_hash, verify_password
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select


def get_user_by_email(session: Session, email: str):
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    return user


def authenticate_user(session: Session, email: str, password: str):
    user = get_user_by_email(session, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login_user(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
):
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.ENVIRONMENT != "local",
        expires=access_token_expires.total_seconds(),
        samesite="lax",
        path="/",
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/register", response_model=UserPublic)
def register_user(session: SessionDep, user_in: UserCreate, response: Response):
    existing_user = get_user_by_email(session, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system",
        )

    user = User.model_validate(
        user_in, update={"hashed_password": get_password_hash(user_in.password)}
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        expires=access_token_expires.total_seconds(),
        secure=settings.ENVIRONMENT != "local",
        httponly=True,
    )
    return user


@router.post("/logout")
def logout_user(response: Response):
    response.delete_cookie(
        key="access_token",
        secure=settings.ENVIRONMENT != "local",
        httponly=True,
    )
    return {"ok": True}
