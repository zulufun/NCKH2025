from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.control import control_router
from .routers.websocket import websocket_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(control_router)
app.include_router(websocket_router)
