from pydantic import BaseModel
from pymongo import MongoClient

# Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['nckh2025']
collection = db['access_logs']

class UserData(BaseModel):
    date: str
    url: str
    email: str
    username: str = 'unknown'
    userAgent: str = 'unknown'
    screenResolution: str = 'unknown'
    referrer: str = 'unknown'
