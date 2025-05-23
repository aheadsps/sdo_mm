import { CoverCurrent } from '@services/api'
import { selectUserCovers } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Typography, Task } from '@shared/components'
import { getDaysLeft } from '@shared/utils'

import s from '../main.module.scss'

export const CurrentTasks = () => {
  const currentEvents = useAppSelector(selectUserCovers)
  const calcDaysLeft = (item: CoverCurrent) => {
    const daysLeft = item.event.end_date
    if (daysLeft === null || undefined) return undefined
    else return getDaysLeft(daysLeft)
  }
  return (
    <div>
      <Typography variant="header_4" className={s.title}>
        Ваши актуальные задачи
      </Typography>

      {currentEvents?.length ? (
        currentEvents.map((result) => {
          return (
            <Task
              key={result.event.course.id}
              daysLeft={calcDaysLeft(result)}
              courseId={result.event.course.id}
            >
              {result.event.course.name}
            </Task>
          )
        })
      ) : (
        <Typography variant="body_1" className={s.noTasksText}>
          Пока у вас нет актуальных задач. Как только появятся, они отобразятся здесь.
        </Typography>
      )}
    </div>
  )
}
