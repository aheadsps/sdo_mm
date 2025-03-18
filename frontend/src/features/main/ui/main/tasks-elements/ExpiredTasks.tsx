import { Typography } from '@shared/components'

import { Task } from '../../task'
import s from '../main.module.scss'

export const ExpiredTasks = () => {
  return (
    <div className={s.expiredTasks}>
      <Typography variant="header_4" className={s.title}>
        Просроченные задачи
      </Typography>
      <Task daysLeft={0}>Экстренные ситуации на рабочем месте</Task>
    </div>
  )
}
