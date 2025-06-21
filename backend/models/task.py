from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from pb import pocketbase
from pocketbase.models import Record

class Task(BaseModel):
    id: str
    title: str
    points: int
    created_at: datetime = Field(alias="created")
    thumbnail: Optional[str] = None
    description: Optional[str] = ""

    @staticmethod
    def from_record(record: Record) -> "Task":
        thumbnail_url = None
        if record.thumbnail:
            thumbnail_url = pocketbase.get_file_url(record, record.thumbnail)
        
        return Task(
            id=record.id,
            title=record.title,
            points=record.points,
            thumbnail=thumbnail_url,
            description=record.description,
            created=record.created
        )
    
    @staticmethod
    def list() -> List["Task"]:
        try:
            result = pocketbase.collection("tasks").get_list()
            return [Task.from_record(record) for record in result.items]
        except Exception as e:
            print(e)
            return []
    
    @staticmethod
    def get_by_id(id: str) -> Optional["Task"]:
        try:
            record = pocketbase.collection("tasks").get_one(id)
            return Task.from_record(record)
        except Exception:
            return None