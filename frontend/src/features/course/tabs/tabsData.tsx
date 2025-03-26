import { AboutCourse, CourseContent, Materials } from '@features/course/tabs'

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
