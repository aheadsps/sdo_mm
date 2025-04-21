import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'
import { useParams } from 'react-router-dom'

import { CourseDropdown } from './CourseDropDown'

export const CourseContent = () => {
  const { id } = useParams()
  const course = useAppSelector(selectCourse)

  return course.lessons.map((lesson) => <CourseDropdown lesson={lesson} id={id} key={lesson.id} />)
}
