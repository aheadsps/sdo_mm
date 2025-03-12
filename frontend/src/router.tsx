import { createBrowserRouter } from 'react-router-dom'

import { Auth } from '@pages/auth'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/',
    element: <div>Hello App</div>,
  },
])
