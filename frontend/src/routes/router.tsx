import {
  AssignmentsCheckLayout,
  StudentAssignmentPage,
  TrainingCenterCourse,
} from '@features/methodist'
import { Lesson } from '@features/user/lesson'
import { AuthPage } from '@pages/auth'
import { MainPage } from '@pages/main'
import { TrainingCenter, ConstructorPage } from '@pages/methodist'
import { CoursePage, Library, MyLearning } from '@pages/user'
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
  {
    path: '/user',
    element: <StudentAssignmentPage />,
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
        path: `${routes.trainingCenterCourse}/user`,
        element: <StudentAssignmentPage />,
      },
      {
        path: `${routes.constructor}/:id`,
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
        path: `${routes.course}/:id/lesson/:lessonId`,
        element: <Lesson />,
      },
      {
        path: routes.library,
        element: <Library />,
      },
    ],
  },
])
