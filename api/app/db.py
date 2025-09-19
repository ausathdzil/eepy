from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine

sqlite_file_name = "eepy.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield
    # SQLModel.metadata.drop_all(engine)
    engine.dispose()
