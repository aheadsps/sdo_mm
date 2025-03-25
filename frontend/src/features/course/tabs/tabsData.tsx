import { AboutCourse } from './about-course/AboutCourse'
import { CourseContent } from './course-content/CourseContent'
import { Materials } from './materials/Materials'

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
