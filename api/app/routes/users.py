from fastapi import APIRouter, Response, status
from fastapi.exceptions import HTTPException

from app.config import settings
from app.deps import CurrentUser, SessionDep
from app.models import UpdatePassword, UserPublic, UserUpdate
from app.security import get_password_hash, verify_password

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def get_current_user(current_user: CurrentUser):
    return current_user


@router.patch("/me", response_model=UserPublic)
def update_me(session: SessionDep, current_user: CurrentUser, user_in: UserUpdate):
    user_data = user_in.model_dump(exclude_unset=True)
    _ = current_user.sqlmodel_update(user_data)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.delete("/me")
def delete_me(session: SessionDep, current_user: CurrentUser, response: Response):
    session.delete(current_user)
    session.commit()
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=settings.ENVIRONMENT != "local",
        path="/",
    )
    return {"ok": True}


@router.patch("/me/password")
def update_password_me(
    session: SessionDep,
    current_user: CurrentUser,
    response: Response,
    password_in: UpdatePassword,
):
    if not verify_password(password_in.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password"
        )
    if password_in.current_password == password_in.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password cannot be the same as the current one",
        )

    new_hashed_password = get_password_hash(password_in.new_password)
    current_user.hashed_password = new_hashed_password
    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=settings.ENVIRONMENT != "local",
        path="/",
    )
    return {"ok": True}
