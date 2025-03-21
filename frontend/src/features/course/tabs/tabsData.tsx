import { AboutCourse } from './about-course/AboutCourse'
import { CourseContent } from './course-content/CourseContent'
import { Materials } from './materials/Materials'

export const tabsData = [
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
