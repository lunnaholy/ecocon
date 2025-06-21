import asyncio
import os
from datetime import datetime
from pocketbase import PocketBase

pocketbase = PocketBase(os.getenv("POCKETBASE_URL"))

def init_pocketbase():
  pocketbase.admins.auth_with_password(os.getenv("POCKETBASE_EMAIL"), os.getenv("POCKETBASE_PASSWORD"))

async def refresh_token():
  while True:
    try:
      pocketbase.admins.auth_refresh()
      print(f"Token refreshed at {datetime.now()}")
    except Exception as e:
      print(f"Error refreshing token: {e}") 
    
    await asyncio.sleep(3600)

async def start_token_refresh():
  asyncio.create_task(refresh_token())