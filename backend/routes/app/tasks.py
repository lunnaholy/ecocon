# routes/app/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from models.task import Task
from models.job import Job
from models.users import TelegramUser
from .auth.dependencies import get_current_user

router = APIRouter()

@router.get("/tasks")
async def list_tasks(user: TelegramUser = Depends(get_current_user)):
    return Task.list()

@router.get("/tasks/{id}")
async def get_task(id: str, user: TelegramUser = Depends(get_current_user)):
    task = Task.get_by_id(id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/tasks/{id}")
async def take_task(id: str, user: TelegramUser = Depends(get_current_user)):
    task = Task.get_by_id(id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    existing_jobs = Job.search(f"task = '{id}' && user = '{user.id}'")
    if existing_jobs:
        raise HTTPException(status_code=400, detail="You are already working on this task")
    
    new_job = Job.create(user, task)
    return new_job