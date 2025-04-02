import { Lesson } from '@features/lesson/LessonComponent'
import { createBrowserRouter } from 'react-router-dom'

import { AuthPage } from '@pages/auth'
import { CoursePage } from '@pages/course/CoursePage'
import { MainPage } from '@pages/main'
import { MyLearning } from '@pages/my-learning/MyLearning'
import { TrainingCenterCourse } from '@pages/trainingCenter/course/TrainingCenterCourse'
import { TrainingCenter } from '@pages/trainingCenter/TrainingCenter'

export const router = createBrowserRouter([
  {
    path: '/main',
    element: <MainPage />,
  },
  {
    path: '/learning',
    element: <MyLearning />,
  },
  {
    path: '/learning/course',
    element: <CoursePage />,
  },
  {
    path: '/library',
    element: <MyLearning />,
  },
  {
    path: '/news',
    element: <MainPage />,
  },
  {
    path: '/auth',
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
])
