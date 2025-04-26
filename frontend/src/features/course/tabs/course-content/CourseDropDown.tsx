import { LessonType } from '@services/api'
import { DropdownCard, Typography, Button } from '@shared/components'
import { useToggle } from '@shared/hooks'
import { NavLink } from 'react-router-dom'

import s from './course-content.module.scss'

type Props = {
  lesson: LessonType
  id?: string
}
export const CourseDropdown = ({ lesson, id }: Props) => {
  const { isOpen, toggle } = useToggle()
  return (
    <DropdownCard
      key={lesson.id}
      title={lesson.name}
      blocks={`${lesson.serial} блок`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <div className={s.contentTitle}>
        <Typography variant="body_2">{lesson.name}</Typography>
        <NavLink to={`/learning/course/${id}/lesson`}>
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
}
