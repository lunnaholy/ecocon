import { Page } from '@/components/Page.tsx';
import { openTelegramLink } from '@telegram-apps/sdk-react';
import { Button, Placeholder } from '@telegram-apps/telegram-ui';
import { useCallback } from 'react';

export function ErrorPage() {
  const contactUs = useCallback(() => {
    openTelegramLink('https://t.me/lunnaholy');
  }, []);

  const refresh = useCallback(() => {
    location.hash = '';
  }, []);

  return (
    <Page back={false}>
      <div className="w-full h-dvh flex justify-center items-center">
        <Placeholder
          description="Мы уже работаем над этим. Попробуйте обновить страницу через некоторое время или напишите нам"
          header="Произошла какая-то ошибка"
          action={<div className='flex flex-col w-full gap-2'>
            <Button size="m" stretched onClick={contactUs}>Связаться с нами</Button>
            <Button size="m" stretched mode="bezeled" onClick={refresh}>Обновить</Button>
          </div>}
        >
          <img
            alt="Telegram sticker"
            width="144"
            src="https://xelene.me/telegram.gif"
          />
        </Placeholder>
      </div>
    </Page>
  );
}
