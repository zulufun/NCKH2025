import asyncio
from fastapi import WebSocket, APIRouter
from app.services.packet_capture import get_packet_queue, send_data

websocket_router = APIRouter()

@websocket_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            if send_data:
                packet_queue = get_packet_queue()
                while not packet_queue.empty():
                    packet_counter, packet_info = packet_queue.get()
                    await websocket.send_json({
                        "packet_counter": packet_counter,
                        "src_ip": packet_info["src_ip"],
                        "dst_ip": packet_info["dst_ip"],
                        "protocol": packet_info["protocol"],
                        "details": packet_info["details"]
                    })
                    await asyncio.sleep(0.1)
            else:
                await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket exception: {e}")
