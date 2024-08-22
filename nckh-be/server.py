import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from scapy.all import sniff
import threading
import queue

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

send_data = False
packet_queue = queue.Queue()  # Hàng đợi để lưu gói tin

def capture_packets(interface, packet_queue):
    def packet_handler(packet):
        # Thêm thông tin gói tin vào hàng đợi
        packet_info = packet.summary()
        packet_queue.put(packet_info)

    def start_sniffing():
        print(f"Bắt đầu bắt gói tin từ interface: {interface}\n")
        sniff(iface=interface, prn=packet_handler)

    # Tạo và khởi chạy thread để bắt gói tin
    capture_thread = threading.Thread(target=start_sniffing)
    capture_thread.start()
    return capture_thread

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global send_data
    await websocket.accept()

    try:
        while True:
            if send_data:
                while not packet_queue.empty():
                    # Gửi từng thông tin gói tin từ hàng đợi qua WebSocket
                    packet_info = packet_queue.get()
                    await websocket.send_text(packet_info)
                await asyncio.sleep(1)  # Gửi dữ liệu mỗi giây để giảm tải cho server
            else:
                await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket exception: {e}")

@app.get("/start")
async def start_data_generation():
    global send_data
    send_data = True
    # Khởi động việc bắt gói tin
    capture_thread = capture_packets('Ethernet', packet_queue)
    return {"status": "Data generation started"}

@app.get("/stop")
async def stop_data_generation():
    global send_data
    send_data = False
    return {"status": "Data generation stopped"}
