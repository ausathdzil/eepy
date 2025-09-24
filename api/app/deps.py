from typing import Annotated

import jwt
from app.config import settings
from app.db import engine
from app.models import TokenPayload, User
from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session, select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_current_user(
    session: SessionDep, access_token: Annotated[str | None, Cookie()] = None
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if access_token is None:
        raise credentials_exception

    try:
        payload = jwt.decode(  # pyright: ignore[reportAny, reportUnknownMemberType]
            access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_payload = TokenPayload.model_validate(payload)
    except (InvalidTokenError, ValidationError):
        raise credentials_exception

    statement = select(User).where(User.email == token_payload.sub)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
