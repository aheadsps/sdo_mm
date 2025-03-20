import { CourseComponent } from '@features/course/Course'
import { withLayout } from '@shared/HOC'

export const Course = () => {
  return (
    <div>
      <CourseComponent />
    </div>
  )
}

export const CoursePage = withLayout(Course)
