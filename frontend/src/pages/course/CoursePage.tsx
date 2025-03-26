import { Course } from '@/features'
import { withLayout } from '@/shared/HOC'

export const CourseComponent = () => {
  return <Course />
}

export const CoursePage = withLayout(CourseComponent)
