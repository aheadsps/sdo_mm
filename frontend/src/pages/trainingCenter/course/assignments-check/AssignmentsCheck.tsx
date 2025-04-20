import { ArrowLeftIcon, ArrowRightIcon, PointsIcon } from '@assets/icons'
import { Card, Typography } from '@shared/components'
import clsx from 'clsx'
import { NavLink, useParams } from 'react-router-dom'

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
      <NavLink to={`/training-center/course/${courseId}`} className={s.backToPage}>
        <ArrowLeftIcon className={s.icon} />
        <Typography variant="body_2" className={s.backText}>
          Вернуться к редактированию курса
        </Typography>
      </NavLink>

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

              <div className={s.studentsList}>
                {students.map((student) => (
                  <div key={student.id} className={s.studentCard}>
                    <div className={s.studentCardleft}>
                      <PointsIcon width="7px" height="13px" className={s.library__icon} />
                      <Typography variant="body_2" className={s.studentName}>
                        {student.name}
                      </Typography>
                    </div>

                    <div className={s.studentCardright}>
                      <ArrowRightIcon width="16px" height="16px" className={s.library__icon} />
                    </div>
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
