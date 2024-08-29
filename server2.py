import multiprocessing
import queue
import asyncio
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime
from pydantic import BaseModel
from collections import defaultdict
import pyshark

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient('mongodb://localhost:27017/')
db = client['nckh2025']
collection = db['access_logs']

send_data = False
packet_queue = queue.Queue()
packet_counter = 0
capture_process = None
websocket_clients = []

def packet_handler(packet):
    global packet_counter
    try:
        src_ip = packet.ip.src
        dst_ip = packet.ip.dst
        protocol = packet.highest_layer
        packet_info = {
            "src_ip": src_ip,
            "dst_ip": dst_ip,
            "protocol": protocol,
            "details": str(packet)
        }
        # Gửi dữ liệu gói tin tới tất cả các WebSocket clients
        for client in websocket_clients:
            asyncio.create_task(client.send_json({
                "packet_counter": packet_counter,
                "src_ip": packet_info["src_ip"],
                "dst_ip": packet_info["dst_ip"],
                "protocol": packet_info["protocol"],
                "details": packet_info["details"]
            }))
        packet_counter += 1
    except AttributeError:
        print(f"Gói tin không chứa lớp IP: {packet}")

def start_capture(interface):
    print(f"Bắt đầu bắt gói tin từ interface: {interface}\n")
    capture = pyshark.LiveCapture(interface=interface)

    try:
        capture.apply_on_packets(packet_handler)
    except Exception as e:
        print(f"Error capturing packets: {e}")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global websocket_clients, send_data
    await websocket.accept()
    websocket_clients.append(websocket)

    try:
        while True:
            if send_data:
                await asyncio.sleep(1)
            else:
                await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket exception: {e}")
    finally:
        websocket_clients.remove(websocket)

@app.get("/start")
async def start_data_generation():
    global send_data, capture_process
    if not send_data:
        send_data = True
        capture_process = multiprocessing.Process(target=start_capture, args=('Wi-Fi',))
        capture_process.start()
    return {"status": "Data generation started"}

@app.get("/stop")
async def stop_data_generation():
    global send_data
    if send_data:
        send_data = False
        if capture_process is not None:
            capture_process.terminate()
            capture_process.join()
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
    try:
        collections = db.list_collection_names()
        total_collections = len(collections)
        total_documents = collection.count_documents({})
        collection_info = {
            "total_collections": total_collections,
            "total_documents": total_documents,
            "max_collection": total_documents,
            "min_collection": total_documents
        }
        return {"data": [collection_info]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/thongke")
async def get_statistics():
    try:
        documents = collection.find()
        month_data = defaultdict(int)

        for document in documents:
            if "date" in document:
                created_at = document["date"]
                if isinstance(created_at, str):
                    created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                    month_year = created_at.strftime("%Y-%m")
                    month_data[month_year] += 1
        statistics = [{"name": month, "count": count} for month, count in month_data.items()]
        statistics.sort(key=lambda x: x["name"])
        return {"data": statistics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/thongkect")
async def get_statistics_details():
    try:
        documents = collection.find()
        statistics = []

        for document in documents:
            if "date" in document:
                created_at = document["date"]
                if isinstance(created_at, str):
                    created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                    month_year = created_at.strftime("%Y-%m")
                    statistics.append({
                        "name": month_year,
                        "date": created_at.strftime("%Y-%m-%d %H:%M:%S")
                    })
        statistics.sort(key=lambda x: x["name"])
        return {"data": statistics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
