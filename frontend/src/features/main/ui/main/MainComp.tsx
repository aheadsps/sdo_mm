import { Task, WarningCard } from '@features/main'
import { Typography } from '@shared/components'

import s from './main.module.scss'

export const MainComp = () => {
  return (
    <div className={s.contentBlock}>
      <div className={s.tasks}>
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
      </div>

      <div>
        <WarningCard />
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
