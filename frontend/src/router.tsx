import { LessonTest } from '@features/lesson/test/Tests'
import { Select } from '@shared/components'
import { createBrowserRouter } from 'react-router-dom'

import { AuthPage } from '@pages/auth'
import { CoursePage } from '@pages/course/CoursePage'
import { MainPage } from '@pages/main'
import { MyLearning } from '@pages/my-learning/MyLearning'
import { TestModal } from '@pages/test-for-modal-page/TestModal'

export const router = createBrowserRouter([
  {
    path: '/main',
    element: <MainPage />,
  },
  {
    path: '/learning',
    element: <MyLearning />,
  },
  {
    path: '/learning/course',
    element: <CoursePage />,
  },
  {
    path: '/library',
    element: <MyLearning />,
  },
  {
    path: '/news',
    element: <MainPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <div>Hello App</div>,
  },

  /* routes for testing components */
  {
    path: '/select',
    element: <Select options={options} />,
  },
  {
    path: '/tests',
    element: <LessonTest />,
  },
])
