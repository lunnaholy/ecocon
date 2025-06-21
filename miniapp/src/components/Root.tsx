import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { Placeholder, Button } from '@telegram-apps/telegram-ui';
import { useCallback } from 'react';
import { Page } from './Page';

function ErrorBoundaryError({ error }: { error: unknown }) {
  const refresh = useCallback(() => {
    location.hash = '';
    location.href = location.href;
  }, []);

  return (
    <Page back={false}>
      <div className="w-full h-dvh flex justify-center items-center">
        <Placeholder
          description={<code>
            {error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : JSON.stringify(error)}
          </code>}
          header="Произошла ошибка"
          action={<div className='flex flex-col w-full gap-2'>
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
    </Page >
  );
};

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <App />
    </ErrorBoundary>
  );
}
