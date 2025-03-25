import { Typography } from '@shared/components'

import s from '../main.module.scss'
import { Task } from '../task'

export const ExpiredTasks = () => {
  const hasExpired = true
  return (
    <div className={s.expiredTasks}>
      <Typography variant="header_4" className={s.title}>
        Просроченные задачи
      </Typography>

      {hasExpired ? (
        <Task daysLeft={0}>Экстренные ситуации на рабочем месте</Task>
      ) : (
        <Typography variant="body_1" className={s.noTasksText}>
          У вас нет просроченных задач. Следите за обновлениями, чтобы оставаться в курсе!
        </Typography>
      )}
    </div>
  )
}
