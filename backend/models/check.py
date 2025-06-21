from pydantic import BaseModel

class CheckResultCreate(BaseModel):
    status: str
    percentage: int
    description: str