from datetime import datetime, timedelta, timezone

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class UserBase(SQLModel):
    full_name: str = Field(max_length=255)
    email: EmailStr = Field(unique=True, index=True, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=255)


class UserUpdate(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=255)
    new_password: str = Field(min_length=8, max_length=255)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    url: list["Url"] = Relationship(back_populates="user", cascade_delete=True)  # pyright: ignore[reportAny]


class UserPublic(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime


class UrlBase(SQLModel):
    long_url: str = Field(index=True, nullable=False)
    short_url: str | None = Field(default=None, index=True, unique=True)


class UrlCreate(UrlBase):
    pass


class UrlUpdate(UrlBase):
    long_url: str | None = Field(default=None)  # pyright: ignore[reportIncompatibleVariableOverride]


class Url(UrlBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=30)
    )

    user_id: int | None = Field(default=None, foreign_key="user.id")
    user: User | None = Relationship(back_populates="url")  # pyright: ignore[reportAny]


class UrlPublic(UrlBase):
    id: int
    created_at: datetime
    expires_at: datetime

    user: UserPublic


class UrlsPublic(SQLModel):
    data: list[UrlPublic]
    count: int
    page: int
    total_pages: int
    has_next: bool
    has_previous: bool


class Token(SQLModel):
    access_token: str
    token_type: str


class TokenPayload(SQLModel):
    sub: str | None = None
    type: str | None = None
