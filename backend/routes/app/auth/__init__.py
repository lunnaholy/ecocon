import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from init_data_py import InitData
from joserfc import jwt
from joserfc.jwk import OctKey
from pydantic import BaseModel

from models.users import TelegramUser
from routes.app.auth.dependencies import get_current_user

router = APIRouter()

class AuthData(BaseModel):
  auth_data: str
  
@router.post("/auth")
async def auth(auth_data: AuthData):
  init_data = InitData.parse(auth_data.auth_data)
  valid = init_data.validate(os.getenv("BOT_TOKEN"))

  if not valid:
    raise HTTPException(status_code=400, detail="Invalid init data")

  user = TelegramUser.upsert(init_data.user)

  key = OctKey.import_key(os.getenv("JWT_SECRET"))
  token = jwt.encode({"alg": "HS256"}, {"sub": user.id, "iat": datetime.now()}, key)
  
  return {"token": token}

@router.get("/me")
async def me(user: TelegramUser = Depends(get_current_user)):
  return user
