from typing import List, Optional
from pydantic import BaseModel, Field
from pb import pocketbase
from pocketbase.models import Record
from .task import Task
from .users import TelegramUser

class CheckInfo(BaseModel):
    id: str
    status: str
    percentage: int

class Job(BaseModel):
    id: str
    task_id: str = Field(alias="task")
    user_id: str = Field(alias="user")
    status: str = "pending"
    proof_file: Optional[str] = None
    
    @staticmethod
    def from_record(record: Record) -> "Job":
        proof_file_url = None
        if record.proof_file:
            proof_file_url = pocketbase.get_file_url(record, record.proof_file)

        return Job(
            id=record.id,
            task=record.task,
            user=record.user,
            status=record.status,
            proof_file=proof_file_url
        )

    @staticmethod
    def create(user: TelegramUser, task: Task):
        record = pocketbase.collection("jobs").create({
            "user": user.id,
            "task": task.id,
            "status": "pending",
        })
        return Job.from_record(record)

    @staticmethod
    def search(filter: str) -> List["Job"]:
        try:
            result = pocketbase.collection("jobs").get_list(query_params={"filter": filter})
            return [Job.from_record(record) for record in result.items]
        except Exception as e:
            print(e)
            return []

    @staticmethod
    def get_by_id(id: str) -> Optional["Job"]:
        try:
            record = pocketbase.collection("jobs").get_one(id)
            return Job.from_record(record)
        except Exception:
            return None