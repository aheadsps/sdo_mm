import { Lesson } from '@features/lesson/LessonComponent'
import { LessonTest } from '@features/lesson/test/Tests'
import { createBrowserRouter } from 'react-router-dom'

import { AuthPage } from '@pages/auth'
import { CoursePage } from '@pages/course/CoursePage'
import { MainPage } from '@pages/main'
import { MyLearning } from '@pages/my-learning/MyLearning'
import { TrainingCenter } from '@pages/trainingCenter/TrainingCenter'

const options = [
  {
    id: 1,
    value: 'Cat',
  },
  {
    id: 2,
    value: 'Dog',
  },
  {
    id: 3,
    value: 'Apple',
  },
]

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
    path: '/lesson',
    element: <Lesson />,
  },

  /* routes for testing components */
  {
    path: '/tests',
    element: <LessonTest />,
  },
])
