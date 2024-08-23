from fastapi import APIRouter
from ..services.packet_capture import send_data_handler

router = APIRouter()

@router.get("/start")
async def start_data_generation():
    send_data_handler.set_send_data(True)
    return {"status": "Data generation started"}

@router.get("/stop")
async def stop_data_generation():
    send_data_handler.set_send_data(False)
    return {"status": "Data generation stopped"}
