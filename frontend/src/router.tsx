import { createBrowserRouter } from 'react-router-dom'

import { Auth } from '@pages/auth'
import AuthPage from '@pages/AuthPage/AuthPage'
import { Main } from '@pages/main'
import { MyLearning } from '@pages/my-learning/MyLearning'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/main',
    element: <Main />,
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
    element: <Main />,
  },
  {
    path: '/authform',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <div>Hello App</div>,
  },
])
