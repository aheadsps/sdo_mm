import { Materials, AboutCourse, CourseContent } from '@features/user'

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
