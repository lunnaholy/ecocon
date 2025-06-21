from aiogram import Bot, Router
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import os

router = Router()
bot = Bot(token=f"{os.getenv('BOT_TOKEN')}", default=DefaultBotProperties(parse_mode='HTML'))

@router.message(Command("start"))
async def start(message: Message):
  markup = InlineKeyboardMarkup(
    inline_keyboard=[
      [InlineKeyboardButton(text="Открыть", web_app=WebAppInfo(url="https://ecodemo.elasticspace.app"))]
    ]
  )
  await message.answer("Сделаем планету зеленее!", reply_markup=markup)
