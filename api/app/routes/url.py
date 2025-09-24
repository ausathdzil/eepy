import math
from typing import Annotated

from app.deps import CurrentUser, SessionDep
from app.models import Url, UrlCreate, UrlPublic, UrlsPublic
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlmodel import col, func, select, text

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
            text("(long_url LIKE :q OR short_url LIKE :q)").bindparams(q=f"%{q}%")
        )

    if order == "desc":
        data_statement = base_statement.order_by(col(Url.created_at).desc())
    else:
        data_statement = base_statement.order_by(col(Url.created_at).asc())

    count_statement = select(func.count()).select_from(base_statement.subquery())
    count = session.exec(count_statement).one()

    total_pages = math.ceil(count / limit) if count > 0 else 0
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


@router.get("/{short_url}")
def redirect_url(short_url: str, session: SessionDep):
    statement = select(Url).where(Url.short_url == short_url)
    url = session.exec(statement).first()
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    return RedirectResponse(status_code=302, url=url.long_url)


@router.delete("/{url_id}")
def delete_url(url_id: int, session: SessionDep):
    url = session.get(Url, url_id)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    session.delete(url)
    session.commit()
    return {"ok": True}
