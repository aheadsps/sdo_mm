import { LessonTest } from '@features/lesson/test/Tests'
import { Course } from '@services/api'

import { Typography } from '../typography'

import s from './scorms.module.scss'
type Props = {
  course: Course
}
export const Scorm = ({ course }: Props) => {
  
  console.log(course.lessons[0])
  return (
    <div className={s.scormBox}>
      <Typography variant="header_3" children={course.name} />
      {course?.lessons.map((lesson) => {
        return (
          <>
            <img key={lesson.id} className={s.scorms} src={course.image} />
            <LessonTest />
          </>
        )
      })}
    </div>
  )
}
