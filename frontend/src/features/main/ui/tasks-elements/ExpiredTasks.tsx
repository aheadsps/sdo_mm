import { selectExpiredCovers } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Typography, Task } from '@shared/components'
import { getDaysLeft } from '@shared/utils'

import s from '../main.module.scss'

export const ExpiredTasks = () => {
  const failedEvents = useAppSelector(selectExpiredCovers)
  // console.log(failedEvents)
  return (
    <div className={s.expiredTasks}>
      <Typography variant="header_4" className={s.title}>
        Просроченные задачи
      </Typography>

      {failedEvents?.length ? (
        failedEvents.map((result) => (
          <Task
            key={result.event.course.id}
            daysLeft={getDaysLeft(result.event.end_date)}
            courseId={result.event.course.id}
          >
            {result.event.course.name}
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
