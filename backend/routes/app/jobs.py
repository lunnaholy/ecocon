# routes/app/jobs.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from models.job import Job
from models.users import TelegramUser
from .auth.dependencies import get_current_user
from pb import pocketbase
from pocketbase.client import FileUpload

router = APIRouter()

@router.get("/jobs")
async def get_my_jobs(user: TelegramUser = Depends(get_current_user)):
    return Job.search(f"user = '{user.id}'")

@router.get("/jobs/{id}")
async def get_my_job(id: str, user: TelegramUser = Depends(get_current_user)):
    job = Job.get_by_id(id)
    if not job or job.user_id != user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/jobs/{id}")
async def upload_proof(id: str, file: UploadFile = File(...), user: TelegramUser = Depends(get_current_user)):
    job = Job.get_by_id(id)
    if not job or job.user_id != user.id:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status != "pending":
         raise HTTPException(status_code=400, detail=f"Job is in '{job.status}' status, cannot upload proof.")

    updated_record = pocketbase.collection("jobs").update(id, {
        "proof_file": FileUpload((file.filename, file.file)),
        "status": "checking"
    })
    
    return Job.from_record(updated_record)