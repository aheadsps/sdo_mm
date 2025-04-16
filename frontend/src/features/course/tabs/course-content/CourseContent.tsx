import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'
import { DropdownCard } from '@shared/components'
import { Button, Typography } from '@shared/components'
import { NavLink } from 'react-router-dom'

import s from './course-content.module.scss'

export const CourseContent = () => {
  const course = useAppSelector(selectCourse)
  return (
    <>
      {course.lessons.map((lesson) => {
        return (
          <DropdownCard key={lesson.id} title={lesson.name} blocks={`${lesson.serial} блок`}>
            <div className={s.contentTitle}>
              <Typography variant="body_2">{lesson.name}</Typography>
              <NavLink to={'/learning/course/lesson'}>
                <Button className={s.lessonButton}>Открыть урок</Button>
              </NavLink>
            </div>
            {lesson.steps.map((step) => {
              return (
                <div key={step.id} className={s.step}>
                  <Typography variant="body_2">{step.title}</Typography>
                  <Typography variant="body_2">{step.content_text}</Typography>
                </div>
              )
            })}
          </DropdownCard>
        )
      })}
    </>
  )
}
