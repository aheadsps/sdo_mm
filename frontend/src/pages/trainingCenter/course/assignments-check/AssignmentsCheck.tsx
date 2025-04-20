import { ArrowRightIcon } from '@assets/icons'
import PointsIcon from '@assets/icons/PointsIcon'
import { routes } from '@routes/routes'
import { Button, Typography } from '@shared/components'
import clsx from 'clsx'
import { Link, useParams } from 'react-router-dom'

import s from './assignments-check.module.scss'
import { getStatusTitle, statusColors, statusGroups } from './assignmentsCheckUtils'
import Status from './Status'

export type Student = {
  id: string
  name: string
  status: Status
}

export const AssignmentsCheck = () => {
  const { id: courseId } = useParams()
  //   const { assignmentId = '1' } = useParams()

  return (
    <div className={s.container}>
      <Link to={`${routes.trainingCenterCourse}/${courseId}`}>
        <Button variant="primary" className={s.button}>
          Список учеников
        </Button>
      </Link>
      <Typography variant="header_2" className={s.container__title}>
        Проверка заданий по курсу
      </Typography>

      <div className={s.card}>
        {Object.entries(statusGroups).map(([status, students]) => (
          <div key={status} className={s.card__container}>
            <div className={clsx(s.card__status, statusColors(status as Status))}>
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
        ))}
      </div>
    </div>
  )
}
