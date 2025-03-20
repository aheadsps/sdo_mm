import { Typography } from '@shared/components'

import { Task } from '../../task'
import s from '../main.module.scss'

export const AssignedCourses = () => {
  return (
    <div>
      <Typography variant="header_4" className={s.title}>
        Назначенные курсы
      </Typography>
      <Task daysLeft={7} className={s.appointedTask}>
        Инструкции по эвакуации и действиям в случае ЧС
      </Task>
    </div>
  )
}
