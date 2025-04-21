import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'

import { CourseDropdown } from './CourseDropDown'

export const CourseContent = () => {
  const course = useAppSelector(selectCourse)

  return course.lessons.map((lesson) => <CourseDropdown lesson={lesson} id={id} key={lesson.id} />)
}
