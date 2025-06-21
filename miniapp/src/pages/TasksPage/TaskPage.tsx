import { api } from '@/api';
import { Task } from '@/api/tasks';
import { Page } from '@/components/Page.tsx';
import { Tabs } from '@/components/Tabs.tsx';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function TaskPage() {
  const { id } = useParams() as { id: string };
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    api.tasks.get(id).then(setTask);
  }, []);

  const takeTask = useCallback(() => {
    setIsLoading(true);
    api.tasks.take(id).then(res => {
      if (res) {
        navigate("/jobs");
      }
    })
    .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <Page back={true}>
      <div className="flex flex-col gap-4 p-4">
        {task ? (
          <>
            <img src={task.thumbnail} className='w-full h-48 object-cover rounded-xl' />
            <div className='flex flex-row items-center justify-between'>
              <span className='text-lg font-bold'>{task.title}</span>
              <span className='text-sm text-gray-500'>{task.points} XP</span>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='text-sm text-gray-500' dangerouslySetInnerHTML={{ __html: task.description }} />
            </div>
            <Button className='w-full' loading={isLoading} onClick={takeTask} disabled={isLoading}>
              Start Task
            </Button>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center h-screen'>
            <Spinner size="l" />
          </div>
        )}
      </div>
      <Tabs />
    </Page>
  );
}