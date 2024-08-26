import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from scapy.all import sniff
import threading
import queue
from pymongo import MongoClient
from datetime import datetime
from pydantic import BaseModel
from scapy.layers.inet import IP

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
capture_thread = None  # Thread để bắt gói tin

def packet_handler(packet):
    global packet_counter
    if packet.haslayer(IP):
        # Phân tách thông tin của gói tin
        packet_info = {
            "src_ip": packet[IP].src,
            "dst_ip": packet[IP].dst,
            "protocol": packet[IP].proto,
            "details": str(packet.show(dump=True))  # Lưu thông tin chi tiết
        }
        packet_queue.put((packet_counter, packet_info))
        packet_counter += 1
    else:
        print(f"Gói tin không chứa lớp IP: {packet.summary()}")

def capture_packets(interface):
    global send_data

    def start_sniffing():
        print(f"Bắt đầu bắt gói tin từ interface: {interface}\n")
        sniff(iface=interface, prn=packet_handler)

    while send_data:  # Chỉ bắt gói tin khi send_data = True
        start_sniffing()

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
                    await websocket.send_json({
                        "packet_counter": packet_counter,
                        "src_ip": packet_info["src_ip"],
                        "dst_ip": packet_info["dst_ip"],
                        "protocol": packet_info["protocol"],
                        "details": packet_info["details"]  # Gửi thông tin chi tiết
                    })
                    await asyncio.sleep(0.1)  # Giảm tải cho server
            else:
                await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket exception: {e}")

@app.get("/start")
async def start_data_generation():
    global send_data, capture_thread

    if not send_data:  # Chỉ bắt đầu nếu chưa bắt đầu
        send_data = True
        capture_thread = threading.Thread(target=capture_packets, args=('Ethernet',))
        capture_thread.start()

    return {"status": "Data generation started"}

@app.get("/stop")
async def stop_data_generation():
    global send_data

    if send_data:  # Chỉ dừng nếu đang bắt gói tin
        send_data = False
        if capture_thread is not None:
            capture_thread.join()  # Đợi thread kết thúc

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
    collection.insert_one(data.dict())
    return {"status": "success"}

@app.post("/log_websocket_packet/")
async def log_websocket_packet(packet_data: dict):
    access_log = {
        "packet_counter": packet_data.get("packet_counter"),
        "src_ip": packet_data.get("src_ip"),
        "dst_ip": packet_data.get("dst_ip"),
        "protocol": packet_data.get("protocol"),
        "details": packet_data.get("details"),
        "logged_time": datetime.now()
    }
    collection.insert_one(access_log)
    return {"status": "success", "message": "Packet logged successfully"}

@app.get("/api/thongke2")
async def get_statistics():
    # Đếm số lượng tài liệu trong collection access_logs
    total_documents = collection.count_documents({})

    # Tạo object để trả về
    statistics = {
        "total_collections": total_documents,
        # Có thể thêm các thống kê khác như:
        # "max_collection": max_value,
        # "min_collection": min_value,
    }

    return statistics
