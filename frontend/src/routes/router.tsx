import { Lesson } from '@features/lesson'
import { AuthPage } from '@pages/auth'
import { ConstructorPage } from '@pages/constructor'
import { CoursePage } from '@pages/course/CoursePage'
import { MainPage } from '@pages/main'
import { MyLearning } from '@pages/my-learning/MyLearning'
import { TrainingCenterCourse } from '@pages/trainingCenter/course/TrainingCenterCourse'
import { TrainingCenter } from '@pages/trainingCenter/TrainingCenter'
import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from './protected-route/ProtectedRoute'
import { routes } from './routes'

export const router = createBrowserRouter([
  /* public routes */
  {
    path: routes.auth,
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <div>Hello App</div>,
  },

  /* private routes */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: routes.auth,
        element: <AuthPage />,
      },

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
        path: '/trainingCenter',
        element: <TrainingCenter />,
      },
      {
        path: '/trainingCenter/course',
        element: <TrainingCenterCourse />,
      },
      {
        path: '/lesson',
        element: <Lesson />,
      },
      {
        path: '/constructor',
        element: <ConstructorPage />,
      },
    ],
  },
])
