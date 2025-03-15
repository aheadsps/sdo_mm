import { Typography } from '@shared/components'

import { Task } from '../task'
import { WarningCard } from '../warning-card'

import s from './main.module.scss'

export const MainResponsive = () => {
  return (
    <div className={s.responsive}>
      <WarningCard />
      <div>
        <Typography variant="header_4" className={s.title}>
          Ваши актуальные задачи
        </Typography>
        <Task daysLeft={2}>Охрана труда</Task>
        <Task daysLeft={4}>Работа с электроинструментом</Task>
        <Task daysLeft={7}>Пожарная безопасность</Task>
        <Task>Охрана труда</Task>
      </div>

      <div className={s.expiredTasks}>
        <Typography variant="header_4" className={s.title}>
          Просроченные задачи
        </Typography>
        <Task daysLeft={0}>Экстренные ситуации на рабочем месте</Task>
      </div>

      <div>
        <Typography variant="header_4" className={s.title}>
          Назначенные курсы
        </Typography>
        <Task daysLeft={7} className={s.appointedTask}>
          Инструкции по эвакуации и действиям в случае ЧС
        </Task>
      </div>
    </div>
  )
}
