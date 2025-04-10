import { Lesson } from '@features/lesson/LessonComponent'
import { AuthPage } from '@pages/auth'
import { ConstructorPage } from '@pages/constructor'
import { CoursePage } from '@pages/course/CoursePage'
import { MainPage } from '@pages/main'
import { MyLearning } from '@pages/my-learning/MyLearning'
import { TrainingCenterCourse } from '@pages/trainingCenter/course/TrainingCenterCourse'
import { TrainingCenter } from '@pages/trainingCenter/TrainingCenter'
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
    path: routes.trainingCenter,
    element: <TrainingCenter />,
  },
  {
    path: routes.trainingCenterCourse,
    element: <TrainingCenterCourse />,
  },
  {
    path: routes.lesson,
    element: <Lesson />,
  },
  {
    path: routes.constructor,
    element: <ConstructorPage />,
  },
])
