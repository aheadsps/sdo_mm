import { routes } from '@routes/routes'
import { Button, Card, Typography } from '@shared/components'
import { Link, useParams } from 'react-router-dom'

import s from './assignments-grades.module.scss'
import { assignments } from './data'

export const AssignmentsGrades = () => {
  const { id: courseId } = useParams()

  return (
    <div className={s.cardsBlock}>
      {assignments.map((assignment) => (
        <Card key={assignment.id} className={s.card}>
          <Typography variant="header_6" className={s.cardTitle}>
            {assignment.title}
          </Typography>
          <div className={s.infoBlock}>
            <div className={s.infoItem}>
              <Typography variant="caption" className={s.caption}>
                Дата дедлайна
              </Typography>
              <Typography variant="body_2" className={s.text}>
                {assignment.deadline}
              </Typography>
            </div>
            <div className={s.infoItem}>
              <Typography variant="caption" className={s.caption}>
                Проверено
              </Typography>
              <Typography variant="body_2" className={s.text}>
                {assignment.checked}
              </Typography>
            </div>
            <div className={s.infoItem}>
              <Typography variant="caption" className={s.caption}>
                Средняя оценка
              </Typography>
              <Typography variant="body_2" className={s.text}>
                {assignment.averageGrade}
              </Typography>
            </div>
          </div>
          <Link to={`${routes.trainingCenterCourse}/${courseId}/${assignment.id}`}>
            <Button variant="primary" className={s.button}>
              Список учеников
            </Button>
          </Link>
        </Card>
      ))}
    </div>
  )
}
