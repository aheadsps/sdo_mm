import { createBrowserRouter } from 'react-router-dom'

import { Auth } from '@pages/auth'
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
])
