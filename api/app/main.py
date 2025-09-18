from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import lifespan
from app.routes import auth, url, users, utils

api_router = APIRouter()
api_router.include_router(utils.router)
api_router.include_router(url.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

if settings.all_cors_origin:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origin,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(router=api_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
