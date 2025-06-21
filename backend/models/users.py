from typing import Optional
from pydantic import BaseModel
from pb import pocketbase
from pocketbase.models import Record
from init_data_py.types import User

class TelegramUser(BaseModel):
    id: str
    telegram_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    xp: int = 0

    def save(self):
        pocketbase.collection("telegram_users").update(self.id, {
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "xp": self.xp
        })

    def delete(self):
        pocketbase.collection("telegram_users").delete(self.id)
    
    @staticmethod
    def from_record(record: Record) -> "TelegramUser":
        return TelegramUser(
            id=record.id,
            telegram_id=record.telegram_id,
            username=record.username,
            first_name=record.first_name,
            last_name=record.last_name,
            xp=record.xp
        )
    
    @staticmethod
    def get_by_id(id: str) -> Optional["TelegramUser"]:
        try:
            record = pocketbase.collection("telegram_users").get_one(id)
            return TelegramUser.from_record(record)
        except Exception:
            return None
    
    @staticmethod
    def get_by_telegram_id(telegram_id: int) -> Optional["TelegramUser"]:
        try:
            record = pocketbase.collection("telegram_users").get_first_list_item(f"telegram_id = '{telegram_id}'")
            return TelegramUser.from_record(record)
        except Exception:
            return None
    
    @staticmethod
    def upsert(user: User) -> "TelegramUser":
        user_db = TelegramUser.get_by_telegram_id(user.id)
        if not user_db:
            record = pocketbase.collection("telegram_users").create({
                "telegram_id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "xp": 0
            })
            return TelegramUser.from_record(record)
        else:
            user_db.username = user.username
            user_db.first_name = user.first_name
            user_db.last_name = user.last_name
            user_db.save()
            return user_db