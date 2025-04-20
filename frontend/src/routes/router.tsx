import { Lesson } from '@features/lesson'
import { AuthPage } from '@pages/auth'
import { ConstructorPage } from '@pages/constructor'
import { CoursePage } from '@pages/course/CoursePage'
import { Library } from '@pages/library'
import { MainPage } from '@pages/main'
import { MyLearning } from '@pages/my-learning/MyLearning'
import { AssignmentsCheckLayout } from '@pages/trainingCenter/course'
import { TrainingCenterCourse } from '@pages/trainingCenter/course/TrainingCenterCourse'
import { TrainingCenter } from '@pages/trainingCenter/TrainingCenter'
import { Role } from '@shared/components/sidebar/sidebar.types'
import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from './protected-route/ProtectedRoute'
import { routes } from './routes'

export const router = createBrowserRouter([
  /* public routes */
  {
    path: routes.auth,
    element: <AuthPage />,
  },

  /* private routes */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: routes.main,
        element: <MainPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={Role.methodologist} />,
    children: [
      {
        path: routes.trainingCenter,
        element: <TrainingCenter />,
      },
      {
        path: `${routes.trainingCenterCourse}/:id`,
        element: <TrainingCenterCourse />,
      },
      {
        path: `${routes.trainingCenterCourse}/:id/:assignmentId`,
        element: <AssignmentsCheckLayout />,
      },
      {
        path: routes.constructor,
        element: <ConstructorPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={Role.student} />,
    children: [
      {
        path: routes.learning,
        element: <MyLearning />,
      },
      {
        path: `${routes.course}/:id`,
        element: <CoursePage />,
      },
      {
        path: `${routes.course}/:id/lesson`,
        element: <Lesson />,
      },
      {
        path: routes.library,
        element: <Library />,
      },
    ],
  },
])
