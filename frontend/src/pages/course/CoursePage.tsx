import { Course } from '@features/course'
import { withLayout } from '@shared/HOC'

export const CourseComponent = () => {
  return <Course />
}

export const CoursePage = withLayout(CourseComponent)
