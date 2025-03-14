import { Task, WarningCard } from '@features/main'
import { Typography } from '@shared/components'
import { withLayout } from '@shared/HOC'

import s from './main.module.scss'

const MainComp = () => {
  return (
    <div className={s.contentBlock}>
      <div>
        <Typography variant="header_4" className={s.title}>
          Ваши актуальные задачи
        </Typography>
        <Task daysLeft={2}>Охрана труда</Task>
        <Task daysLeft={4}>Работа с электроинструментом</Task>
        <Task daysLeft={7}>Пожарная безопасность</Task>
        <Task>Охрана труда</Task>

        <div className={s.taskBlock}>
          <Typography variant="header_4" className={s.title}>
            Оказание первой помощи
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

export const Main = withLayout(MainComp)
