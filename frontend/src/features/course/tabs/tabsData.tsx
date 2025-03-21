import { CourseMaterials } from '../course-materials/CourseMaterials'

import { AboutCourse } from './about-course/AboutCourse'
import { CourseContent } from './course-content/CourseContent'

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
    content: <CourseMaterials />,
  },
]
