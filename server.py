import asyncio
from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from scapy.all import sniff
import threading
import queue
from pymongo import MongoClient
from datetime import datetime
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['nckh2025']
collection = db['access_logs']

send_data = False
packet_queue = queue.Queue()  # Hàng đợi để lưu gói tin
packet_counter = 0  # Đếm số lượng gói tin đã gửi

def capture_packets(interface, packet_queue):
    def packet_handler(packet):
        global packet_counter
        # Thêm thông tin gói tin vào hàng đợi và biến text
        packet_info = packet.summary()
        packet_queue.put((packet_counter, packet_info))
        packet_counter += 1

    def start_sniffing():
        print(f"Bắt đầu bắt gói tin từ interface: {interface}\n")
        sniff(iface=interface, prn=packet_handler)

    # Tạo và khởi chạy thread để bắt gói tin
    capture_thread = threading.Thread(target=start_sniffing)
    capture_thread.start()
    return capture_thread

# Khởi động việc bắt gói tin
capture_thread = capture_packets('Ethernet', packet_queue)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global send_data
    await websocket.accept()

    try:
        while True:
            if send_data:
                while not packet_queue.empty():
                    # Lấy thông tin gói tin từ hàng đợi
                    packet_counter, packet_info = packet_queue.get()
                    # Gửi thông tin gói tin qua WebSocket
                    await websocket.send_text(f"{packet_counter}: {packet_info}")
                    await asyncio.sleep(0.1)  # Giảm tải cho server
            else:
                await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket exception: {e}")

@app.get("/start")
async def start_data_generation():
    global send_data
    send_data = True
    return {"status": "Data generation started"}

@app.get("/stop")
async def stop_data_generation():
    global send_data
    send_data = False
    return {"status": "Data generation stopped"}

class UserData(BaseModel):
    date: str
    url: str
    email: str
    username: str = 'unknown'
    userAgent: str = 'unknown'
    screenResolution: str = 'unknown'
    referrer: str = 'unknown'

@app.post("/collect")
async def collect_user_data(data: UserData):
    # Lưu dữ liệu vào MongoDB
    collection.insert_one(data.dict())  # Xóa await
    return {"status": "success"}
@app.post("/log_websocket_packet/")
async def log_websocket_packet(packet_data: dict):
    access_log = {
        "packet_counter": packet_data.get("packet_counter"),
        "packet_info": packet_data.get("packet_info"),
        "logged_time": datetime.now()
    }
    await collection.insert_one(access_log)
    return {"status": "success", "message": "Packet logged successfully"}