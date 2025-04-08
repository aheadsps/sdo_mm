import { selectCurrentEvents } from '@services/slices/events'
import { useAppSelector } from '@services/store'
import { Typography, Task } from '@shared/components'
import { getDaysLeft } from '@shared/utils'

import s from '../main.module.scss'

export const CurrentTasks = () => {
  const currentEvents = useAppSelector(selectCurrentEvents)
  return (
    <div>
      <Typography variant="header_4" className={s.title}>
        Ваши актуальные задачи
      </Typography>

      {currentEvents?.length ? (
        currentEvents.map((result) => (
          <Task key={result.id} daysLeft={getDaysLeft(result.end_date)}>
            {result.course.name}
          </Task>
        ))
      ) : (
        <Typography variant="body_1" className={s.noTasksText}>
          Пока у вас нет актуальных задач. Как только появятся, они отобразятся здесь.
        </Typography>
      )}
    </div>
  )
}
