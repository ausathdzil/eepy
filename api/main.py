from api.config import settings
from fastapi import FastAPI

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
