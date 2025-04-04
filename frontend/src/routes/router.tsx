import { Lesson } from '@features/lesson/LessonComponent'
import { LessonTest } from '@features/lesson/test/Tests'
import { createBrowserRouter } from 'react-router-dom'

import { AuthPage } from '@pages/auth'
import { CoursePage } from '@pages/course'
import { MainPage } from '@pages/main'
import { MyLearning } from '@pages/my-learning/MyLearning'
import { TrainingCenterCourse } from '@pages/trainingCenter/course/TrainingCenterCourse'
import { TrainingCenter } from '@pages/trainingCenter/TrainingCenter'

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
    path: '/',
    element: <div>Hello App</div>,
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

  /* routes for testing components */
  {
    path: '/tests',
    element: <LessonTest />,
  },
])
