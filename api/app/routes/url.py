from datetime import datetime, timezone
from typing import Annotated

from app.deps import CurrentUser, SessionDep
from app.models import Url, UrlCreate, UrlPublic, UrlUpdate, UrlsPublic
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlmodel import col, func, or_, select

router = APIRouter(prefix="/url", tags=["url"])


def base62_encode(num: int) -> str:
    s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    hash_str = ""
    while num > 0:
        hash_str = s[num % 62] + hash_str
        num //= 62
    return hash_str


@router.post("/", response_model=UrlPublic)
def shorten_url(url_in: UrlCreate, session: SessionDep, current_user: CurrentUser):
    url = Url.model_validate(url_in, update={"user_id": current_user.id})
    if url.short_url:
        statement = select(Url).where(Url.short_url == url.short_url)
        if session.exec(statement).first():
            raise HTTPException(status_code=400, detail="Short URL already exists")

    session.add(url)
    session.flush()
    if not url.short_url and url.id:
        url.short_url = base62_encode(url.id)

    try:
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(status_code=400, detail="Short URL already exists")

    session.refresh(url)
    return url


@router.get("/", response_model=UrlsPublic)
def read_urls(
    session: SessionDep,
    current_user: CurrentUser,
    q: Annotated[str | None, Query(max_length=255)] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(le=100)] = 6,
    order: Annotated[str | None, Query(regex="^(asc|desc)$")] = "desc",
) -> UrlsPublic:
    base_statement = select(Url).where(Url.user_id == current_user.id)

    if q:
        base_statement = base_statement.where(
            or_(col(Url.long_url).like(f"%{q}%"), col(Url.short_url).like(f"%{q}%"))
        )

    if order == "desc":
        data_statement = base_statement.order_by(col(Url.created_at).desc())
    else:
        data_statement = base_statement.order_by(col(Url.created_at).asc())

    count_statement = select(func.count()).select_from(base_statement.subquery())
    count = session.exec(count_statement).one()

    total_pages = (count + limit - 1) // limit
    has_next = page < total_pages
    has_previous = page > 1

    offset = (page - 1) * limit

    data_statement = data_statement.offset(offset).limit(limit)
    urls = session.exec(data_statement).all()

    data = [UrlPublic.model_validate(url) for url in urls]

    return UrlsPublic(
        data=data,
        count=count,
        page=page,
        total_pages=total_pages,
        has_next=has_next,
        has_previous=has_previous,
    )


@router.get("/{url_id}", response_model=UrlPublic)
def read_url(session: SessionDep, current_user: CurrentUser, url_id: int):
    url = session.get(Url, url_id)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    if url.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return url


@router.patch("/{url_id}", response_model=UrlPublic)
def update_url(
    session: SessionDep, current_user: CurrentUser, url_id: int, url_in: UrlUpdate
):
    url = session.get(Url, url_id)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    if url.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if url_in.short_url:
        existing_url = session.get(Url, url_in.short_url)
        if existing_url is not None:
            raise HTTPException(status_code=400, detail="Short URL already exists")

    url_data = url_in.model_dump(exclude_unset=True)
    _ = url.sqlmodel_update(url_data)
    session.add(url)
    session.commit()
    session.refresh(url)
    return url


@router.delete("/{url_id}")
def delete_url(session: SessionDep, current_user: CurrentUser, url_id: int):
    url = session.get(Url, url_id)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    if url.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    session.delete(url)
    session.commit()
    return {"ok": True}


@router.get("/r/{short_url}")
def redirect_url(session: SessionDep, short_url: str):
    statement = select(Url).where(Url.short_url == short_url)
    url = session.exec(statement).first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    expires_at = url.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="URL has expired")

    return RedirectResponse(status_code=302, url=url.long_url)
