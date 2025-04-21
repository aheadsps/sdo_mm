import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Scorm } from '@shared/components'
import { useParams } from 'react-router-dom'

import { CourseDropdown } from './CourseDropDown'

export const CourseContent = () => {
  const { id } = useParams()
  const course = useAppSelector(selectCourse) //className={s.scorms}

  return course.is_scorm === true
    ? course.lessons.map((lesson) => <Scorm course={course} key={lesson.id} />)
    : course.lessons.map((lesson) => <CourseDropdown lesson={lesson} id={id} key={lesson.id} />)
}
