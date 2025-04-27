import { selectUserCovers } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Typography, Task } from '@shared/components'
import { getDaysLeft } from '@shared/utils'
import { getDeadlineStatus } from '@shared/utils/getDeadlineStatus'

import s from '../main.module.scss'

export const CurrentTasks = () => {
  const currentEvents = useAppSelector(selectUserCovers)
  console.log(currentEvents)
  const calcDaysLeft = (item) => {
    // const isEndDate = () => {
    //   if (item.event.end_date === null) return false
    //   else return true
    // }
    // const daysLeft = () => {
    //   isEndDate() === true?
    // }

    const daysLeft = item.event.end_date
    if (daysLeft === null || undefined) return undefined
    else return getDaysLeft(daysLeft)
  }
  // const status =
  // daysLeft === undefined
  //   ? 'Бессрочно'
  //   : cover.status !== 'failed' && daysLeft > 0
  //     ? getDeadlineStatus(daysLeft)
  //     : 'Просрочен'
  // console.log(currentEvents)
  return (
    <div>
      <Typography variant="header_4" className={s.title}>
        Ваши актуальные задачи
      </Typography>

      {currentEvents?.length ? (
        currentEvents.map((result) => {
          const daysLeft = getDaysLeft(result.event.end_date)
          console.log(daysLeft)
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
