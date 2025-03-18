import { Typography } from '@shared/components'

import { Task } from '../../task'
import s from '../main.module.scss'

export const CurrentTasks = () => {
  return (
    <div>
      <Typography variant="header_4" className={s.title}>
        Ваши актуальные задачи
      </Typography>
      <Task daysLeft={2}>Охрана труда</Task>
      <Task daysLeft={4}>Работа с электроинструментом</Task>
      <Task daysLeft={7}>Пожарная безопасность</Task>
      <Task>Охрана труда</Task>
    </div>
  )
}
