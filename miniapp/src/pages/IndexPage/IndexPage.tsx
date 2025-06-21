import { api } from '@/api';
import { UserResponse } from '@/api/auth';
import { Task } from '@/api/tasks';
import { Page } from '@/components/Page.tsx';
import { Tabs } from '@/components/Tabs.tsx';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { Spinner } from '@telegram-apps/telegram-ui';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function IndexPage() {
  const navigate = useNavigate();
  const initDataRaw = useSignal(initData.raw);

  const [me, setMe] = useState<UserResponse | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    api.auth.login(initDataRaw || "")
      .then(res => {
        localStorage.setItem("access_token", res.token);
        api.auth.me().then(setMe);
        api.tasks.list().then(setTasks);
      })
      .catch(err => {
        console.error(err);
        navigate("/error");
      });
  }, []);

  return (
    <Page back={false}>
      <div className="flex flex-col gap-2 p-4">
        {me ? (
          <>
            <div className='flex flex-col w-full p-4 rounded-xl shadow bg-background gap-2'>
              <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row gap-2'>
                  {/* <img src="https://cataas.com/cat?type=square" className='w-8 h-8 rounded-full' /> */}
                  <div className='flex flex-col'>
                    <span className='text-lg font-bold'>Hello, {me.first_name}!</span>
                  </div>
                </div>
                <div className='flex flex-row gap-2'>
                  <span className='text-sm text-gray-500'>XP: {me.xp}</span>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='h-2 bg-secondary rounded-full'>
                  <div className='h-2 bg-primary rounded-full' style={{ width: `${me.xp}%` }} />
                </div>
                <div className='flex flex-row gap-2 justify-between'>
                  <span className='text-sm text-gray-500'>1 Level</span>
                  <span className='text-sm text-gray-500'>100 XP</span>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-center justify-between gap-2'>
              {tasks.map((task, index) => (
                <div className='flex flex-col w-full cursor-pointer' onClick={() => navigate(`/task/${task.id}`)} key={`task-${index}`}>
                  <div className='flex flex-col w-full rounded-t-xl shadow bg-background gap-2'>
                    <img src={task.thumbnail} className='w-full h-48 object-cover rounded-t-xl' />
                  </div>
                  <div className='flex flex-col w-full p-4 rounded-b-xl shadow bg-background gap-2'>
                    <div className='flex flex-row items-center justify-between'>
                      <span className='text-lg font-bold'>{task.title}</span>
                      <span className='text-sm text-gray-500'>{task.points} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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