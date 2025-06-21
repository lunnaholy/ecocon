import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from joserfc import jwt
from joserfc.errors import InvalidTokenError
from joserfc.jwk import OctKey
from models.users import TelegramUser

auth_scheme = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(auth_scheme)):
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
  )

  try:
    key = OctKey.import_key(os.getenv("JWT_SECRET"))
    payload = jwt.decode(token.credentials, key)
    user_id = payload.claims.get("sub")
    if user_id is None:
      raise credentials_exception
    user = TelegramUser.get_by_id(user_id)
    if user is None:
      raise credentials_exception
    return user
  except InvalidTokenError:
    raise credentials_exception