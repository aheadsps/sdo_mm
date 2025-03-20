import { createBrowserRouter } from 'react-router-dom'

import { AuthPage } from '@pages/auth'
import { MainPage } from '@pages/main'
import { MyLearning } from '@pages/my-learning/MyLearning'

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
])
