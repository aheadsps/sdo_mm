import { ArrowRightIcon, PointsIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { BackToPage, Card, Typography } from '@shared/components'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'

import s from './assignments-check.module.scss'
import { getStatusTitle, statusColors, statusGroups, statusIcon } from './assignmentsCheckUtils'
import Status from './Status'

export type Student = {
  id: string
  name: string
  status: Status
}

export const AssignmentsCheck = () => {
  const { id: courseId } = useParams()

  return (
    <div className={s.container}>
      <BackToPage to={`${routes.trainingCenterCourse}/${courseId}`}>
        Вернуться к редактированию курса
      </BackToPage>
      <Typography variant="header_2" className={s.container__title}>
        Проверка заданий по курсу
      </Typography>
      <div className={s.cards}>
        {Object.entries(statusGroups).map(([status, students]) => (
          <Card className={s.card}>
            <div key={status} className={s.card__content}>
              <div className={clsx(s.card__status, statusColors(status as Status))}>
                {statusIcon(status as Status)}
                <Typography variant="body_2" className={s.card__title}>
                  {getStatusTitle(status as Status)}
                </Typography>
              </div>
              <div className={s.card__list}>
                {students.map((student) => (
                  <div key={student.id} className={s.card__item}>
                    <div className={s.card__itemLeft}>
                      <PointsIcon width="7px" height="13px" />
                      <Typography variant="body_2" className={s.card__itemName}>
                        {student.name}
                      </Typography>
                    </div>
                    <ArrowRightIcon width="16px" height="16px" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
