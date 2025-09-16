from datetime import datetime, timedelta, timezone
from sqlmodel import Field, SQLModel


class UrlBase(SQLModel):
    long_url: str = Field(index=True)


class UrlCreate(UrlBase):
    pass


class Url(UrlBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    short_url: str | None = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=30)
    )


class UrlPublic(UrlBase):
    id: int
    short_url: str
    created_at: datetime
    expires_at: datetime


class UrlsPublic(SQLModel):
    data: list[UrlPublic]
    count: int
