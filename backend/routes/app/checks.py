# routes/app/checks.py
from fastapi import APIRouter, Depends, HTTPException
from models.job import Job
from models.users import TelegramUser
from models.check import CheckResultCreate
from .auth.dependencies import get_current_user
from pb import pocketbase

router = APIRouter()

@router.get("/checks")
async def get_job_for_check(user: TelegramUser = Depends(get_current_user)):
    try:
        result = pocketbase.collection("jobs").get_list(
            page=1,
            per_page=1,
            query_params={
                "sort": "@random",
                "filter": f"status = 'checking'"
            }
        )
        if not result.items:
            raise HTTPException(status_code=404, detail="No jobs available for checking")
        
        job_to_check = result.items[0]
        return Job.from_record(job_to_check)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"No jobs available for checking: {e}")


@router.post("/checks/{job_id}")
async def submit_check(job_id: str, result: CheckResultCreate, user: TelegramUser = Depends(get_current_user)):
    job_to_check = Job.get_by_id(job_id)
    if not job_to_check:
        raise HTTPException(status_code=404, detail="Job not found")
    
    pocketbase.collection("checks").create({
        "job": job_id,
        "checker": user.id,
        "status": result.status,
        "percentage": result.percentage,
        "description": result.description
    })

    new_status = ""
    if result.status == "done":
        new_status = "done"
        task_owner = TelegramUser.get_by_id(job_to_check.user_id)
        task_info = pocketbase.collection("tasks").get_one(job_to_check.task_id)
        task_owner.xp += task_info.points
        task_owner.save()

    elif result.status == "failed":
        new_status = "pending"
    
    if new_status:
        pocketbase.collection("jobs").update(job_id, {"status": new_status})

    return {"status": "success", "updated_job_status": new_status}