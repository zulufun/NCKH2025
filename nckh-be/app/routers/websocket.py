from fastapi import APIRouter, WebSocket
from ..services.packet_capture import packet_queue, send_data_handler
import asyncio

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            if send_data_handler.get_send_data():
                while not packet_queue.empty():
                    packet_counter, packet_info = packet_queue.get()
                    await websocket.send_text(f"{packet_counter}: {packet_info}")
                    await asyncio.sleep(0.1)
            else:
                await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket exception: {e}")
