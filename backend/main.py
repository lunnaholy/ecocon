import asyncio
import os
from aiogram import Dispatcher
import dotenv
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pb import start_token_refresh, init_pocketbase
from bot import bot, router as bot_router
import multiprocessing
from routes.app import me, tasks, jobs, checks 
from routes.app.auth import router as auth_router

dotenv.load_dotenv(".env")

def run_bot():
  dp = Dispatcher()
  dp.include_router(bot_router)
    
  loop = asyncio.new_event_loop()
  asyncio.set_event_loop(loop)
  loop.run_until_complete(dp.start_polling(bot))

@asynccontextmanager
async def lifespan(app: FastAPI):
  init_pocketbase()  
  await start_token_refresh()
  
  if os.getenv("BOT_ENABLED") == "1":
    bot_process = multiprocessing.Process(target=run_bot)
    bot_process.start()
    app.state.bot_process = bot_process
  else:
    print("Bot is disabled")
    
  yield
    
  if os.getenv("BOT_ENABLED") == "1": 
    bot_process.terminate()
    bot_process.join()
  else:
    print("Bot is disabled")

app = FastAPI(
  lifespan=lifespan
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(me.router, prefix="/api", tags=["Пользователь"])
app.include_router(tasks.router, prefix="/api", tags=["Задачи"])
app.include_router(jobs.router, prefix="/api", tags=["Мои задания"])
app.include_router(checks.router, prefix="/api", tags=["Проверка заданий"])