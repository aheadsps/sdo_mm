import { Event } from '@services/events'
import { Typography, Task } from '@shared/components'
import { getDaysLeft } from '@shared/utils'

import s from '../main.module.scss'

type Props = {
  failedEvents: Event[] | undefined
}
export const ExpiredTasks = ({ failedEvents }: Props) => {
  return (
    <div className={s.expiredTasks}>
      <Typography variant="header_4" className={s.title}>
        Просроченные задачи
      </Typography>

      {failedEvents?.length ? (
        failedEvents.map((result) => (
          <Task daysLeft={getDaysLeft(result.end_date)}>{result.course.name}</Task>
        ))
      ) : (
        <Typography variant="body_1" className={s.noTasksText}>
          У вас нет просроченных задач. Следите за обновлениями, чтобы оставаться в курсе!
        </Typography>
      )}
    </div>
  )
}
