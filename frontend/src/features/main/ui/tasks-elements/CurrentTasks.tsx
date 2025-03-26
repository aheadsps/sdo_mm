import s from '../main.module.scss'

import { useGetCurrentEventsQuery } from '@/services'
import { Typography, Task } from '@/shared/components'

export const CurrentTasks = () => {
  const { data: events } = useGetCurrentEventsQuery()

  return (
    <div>
      <Typography variant="header_4" className={s.title}>
        Ваши актуальные задачи
      </Typography>

      {events?.results.length ? (
        <>
          <Task daysLeft={2}>Охрана труда</Task>
          <Task daysLeft={4}>Работа с электроинструментом</Task>
          <Task daysLeft={7}>Пожарная безопасность</Task>
          <Task>Охрана труда</Task>
        </>
      ) : (
        <Typography variant="body_1" className={s.noTasksText}>
          Пока у вас нет актуальных задач. Как только появятся, они отобразятся здесь.
        </Typography>
      )}
    </div>
  )
}
