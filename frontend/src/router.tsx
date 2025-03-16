import { createBrowserRouter } from 'react-router-dom'

import { Auth } from '@pages/auth'

import AuthForm from '../src/features/AuthForm/AuthForm'
import AuthPage from '@pages/auth/AuthPage/AuthPage'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/authform',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <div className={'text-center'}>Hello App</div>,
  },
])
