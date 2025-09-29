from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from app.config import settings
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str):
    return pwd_context.hash(password)


def create_token(
    data: dict[str, Any],  # pyright: ignore[reportExplicitAny]
    expires_delta: timedelta,
    type: str | None = None,
):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta

    to_encode.update({"exp": expire})
    if type is not None:
        to_encode.update({"type": type})
    encoded_jwt = jwt.encode(  # pyright: ignore[reportUnknownMemberType]
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt
