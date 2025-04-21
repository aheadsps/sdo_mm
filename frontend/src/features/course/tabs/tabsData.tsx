import { AboutCourse } from './about-course'
import { CourseContent } from './course-content'
import { Materials } from './materials'

export type Tab = {
  label: string
  content: React.ReactNode
}

export const tabsData: Tab[] = [
  {
    label: 'О курсе',
    content: <AboutCourse />,
  },
  {
    label: 'Содержание',
    content: <CourseContent />,
  },
  {
    label: 'Материалы',
    content: <Materials />,
  },
]
