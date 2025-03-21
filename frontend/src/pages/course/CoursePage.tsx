import { CourseComponent } from '@features/course/Course'
import { withLayout } from '@shared/HOC'

export const Course = () => {
  return <CourseComponent />
}

export const CoursePage = withLayout(Course)
