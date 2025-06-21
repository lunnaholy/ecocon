import type { ComponentType, JSX } from 'react';

import { ChecksPage } from '@/pages/ChecksPage/ChecksPage';
import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { JobsPage } from '@/pages/JobsPage/JobsPage';
import { TaskPage } from '@/pages/TasksPage/TaskPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/jobs', Component: JobsPage },
  { path: '/checks', Component: ChecksPage },
  { path: '/task/:id', Component: TaskPage },
];
