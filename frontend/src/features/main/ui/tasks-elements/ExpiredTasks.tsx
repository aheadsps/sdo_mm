import { selectExpiredEvents } from '@services/slices/events'
import { useAppSelector } from '@services/store'
import { Typography, Task } from '@shared/components'
import { getDaysLeft } from '@shared/utils'

import s from '../main.module.scss'

export const ExpiredTasks = () => {
  const failedEvents = useAppSelector(selectExpiredEvents)
  return (
    <div className={s.expiredTasks}>
      <Typography variant="header_4" className={s.title}>
        Просроченные задачи
      </Typography>

      {failedEvents?.length ? (
        failedEvents.map((result) => (
          <Task key={result.id} daysLeft={getDaysLeft(result.end_date)} courseId={result.course.id}>
            {result.course.name}
          </Task>
        ))
      ) : (
        <Typography variant="body_1" className={s.noTasksText}>
          У вас нет просроченных задач. Следите за обновлениями, чтобы оставаться в курсе!
        </Typography>
      )}
    </div>
  )
}
