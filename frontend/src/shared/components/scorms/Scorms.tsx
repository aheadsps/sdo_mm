import { LessonTest } from '@features/lesson/test/Tests'
import { Course, useGetTestsQuery } from '@services/api'

import { Typography } from '../typography'

import s from './scorms.module.scss'
type Props = {
  course: Course
}
export const Scorm = ({ course }: Props) => {
  // const [data: tests ] = useGetTestsQuery(course.lessons[0].test_block)
  // console.log(console.log)
  // console.log(course.lessons[0].test_block)
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
