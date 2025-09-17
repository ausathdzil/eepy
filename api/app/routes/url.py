from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from sqlmodel import func, select

from app.db import SessionDep
from app.models import Url, UrlCreate, UrlsPublic

router = APIRouter(prefix="/url", tags=["url"])


def base62_encode(num: int) -> str:
    s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    hash_str = ""
    while num > 0:
        hash_str = s[num % 62] + hash_str
        num //= 62
    return hash_str


@router.post("/shorten")
def shorten_url(url_in: UrlCreate, session: SessionDep):
    url = Url(long_url=url_in.long_url)
    if url_in.short_url:
        statement = select(Url).where(Url.short_url == url_in.short_url)
        existing_url = session.exec(statement).first()
        if existing_url:
            raise HTTPException(status_code=400, detail="Short URL already exists")
        url.short_url = url_in.short_url
    session.add(url)
    session.commit()
    session.refresh(url)

    if not url.short_url:
        url.short_url = base62_encode(url.id)
    session.add(url)
    session.commit()
    session.refresh(url)

    return url


@router.get("/", response_model=UrlsPublic)
def read_urls(session: SessionDep) -> UrlsPublic:
    count_statement = select(func.count()).select_from(Url)
    count = session.exec(count_statement).one()
    statement = select(Url)
    urls = session.exec(statement).all()
    return UrlsPublic(data=urls, count=count)


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
