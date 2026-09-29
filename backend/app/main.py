from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.database.db import engine, Base
from app.models.experiment import Experiment  # noqa: F401 — registers model

from app.api import scheduling, memory, deadlock, sync, disk, ipc, io, experiments, whatif

app = FastAPI(
    title="OScopeX API",
    description="OS Digital Twin Backend — CPU Scheduling, Memory, Deadlock, IPC, Disk",
    version="1.0.0",
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5174").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


app.include_router(scheduling.router, prefix="/api")
app.include_router(memory.router, prefix="/api")
app.include_router(deadlock.router, prefix="/api")
app.include_router(sync.router, prefix="/api")
app.include_router(disk.router, prefix="/api")
app.include_router(ipc.router, prefix="/api")
app.include_router(io.router, prefix="/api")
app.include_router(experiments.router, prefix="/api")
app.include_router(whatif.router, prefix="/api")
