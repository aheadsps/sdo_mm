import { AuthPage } from '@pages/auth'
import { CoursePage } from '@pages/course'
import { MainPage } from '@pages/main'
import { MyLearning } from '@pages/my-learning'
import { createBrowserRouter } from 'react-router-dom'

import { routes } from './routes'

export const router = createBrowserRouter([
  {
    path: routes.main,
    element: <MainPage />,
  },
  {
    path: routes.learning,
    element: <MyLearning />,
  },
  {
    path: routes.course,
    element: <CoursePage />,
  },
  {
    path: routes.library,
    element: <MyLearning />,
  },
  {
    path: routes.news,
    element: <MainPage />,
  },
  {
    path: routes.auth,
    element: <AuthPage />,
  },
  {
    path: routes.home,
    element: <div>Hello App APP</div>,
  },
])
