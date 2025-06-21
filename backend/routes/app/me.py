# routes/app/me.py
from fastapi import APIRouter, Depends
from models.users import TelegramUser
from .auth.dependencies import get_current_user

router = APIRouter()

@router.get("/me")
async def read_me(current_user: TelegramUser = Depends(get_current_user)):
    return current_user