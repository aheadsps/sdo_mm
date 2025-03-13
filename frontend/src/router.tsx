import { createBrowserRouter } from 'react-router-dom'

import { Auth } from '@pages/auth'
import { Main } from '@pages/main'

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
    path: '/',
    element: <div>hello App</div>,
  },
])
