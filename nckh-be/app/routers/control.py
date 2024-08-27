from fastapi import APIRouter
from app.services.packet_capture import start_capture, stop_capture
from app.models import UserData, collection

control_router = APIRouter()

@control_router.get("/start")
async def start_data_generation():
    return start_capture()

@control_router.get("/stop")
async def stop_data_generation():
    return stop_capture()

@control_router.post("/collect")
async def collect_user_data(data: UserData):
    collection.insert_one(data.dict())
    return {"status": "success"}

@control_router.get("/api/thongke")
async def get_statistics():
    total_documents = collection.count_documents({})
    return {"total_collections": total_documents}
