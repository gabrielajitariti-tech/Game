from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class GameSave(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slot: int = 0
    player_data: Dict[str, Any] = {}
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class GameSaveCreate(BaseModel):
    slot: int = 0
    player_data: Dict[str, Any] = {}


class GameConfig(BaseModel):
    version: str = "1.0.0"
    game_name: str = "Dark Hollow"


@api_router.get("/")
async def root():
    return {"message": "Dark Hollow API"}


@api_router.get("/game/config", response_model=GameConfig)
async def get_game_config():
    return GameConfig()


@api_router.post("/game/save", response_model=GameSave)
async def save_game(save_data: GameSaveCreate):
    save_obj = GameSave(slot=save_data.slot, player_data=save_data.player_data)
    doc = save_obj.model_dump()
    await db.game_saves.update_one(
        {"slot": save_data.slot}, {"$set": doc}, upsert=True
    )
    return save_obj


@api_router.get("/game/saves", response_model=List[GameSave])
async def get_saves():
    saves = await db.game_saves.find({}, {"_id": 0}).to_list(10)
    return saves


@api_router.get("/game/load/{slot}")
async def load_game(slot: int):
    save = await db.game_saves.find_one({"slot": slot}, {"_id": 0})
    if not save:
        return {"error": "No save found", "slot": slot}
    return save


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
