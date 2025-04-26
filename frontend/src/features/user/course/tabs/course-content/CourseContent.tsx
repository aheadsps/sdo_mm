import { Course } from '@services/api'
import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Scorm } from '@shared/components'
import { useParams } from 'react-router-dom'

import { CourseDropdown } from './CourseDropDown'

export const CourseContent = () => {
  const { id } = useParams()
  const course: Course = useAppSelector(selectCourse)
  const isScorm = course.is_scorm
  return isScorm === true
    ? course.lessons.map((lesson) => <Scorm course={course} key={lesson.id} />)
    : course.lessons.map((lesson) => <CourseDropdown lesson={lesson} id={id} key={lesson.id} />)
}
