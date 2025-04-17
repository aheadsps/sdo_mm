import { selectUser } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Schedule, Typography } from '@shared/components'
import { Role } from '@shared/components/sidebar/sidebar.types'

import s from './main.module.scss'
import { CurrentTasks } from './tasks-elements/CurrentTasks'
import { ExpiredTasks } from './tasks-elements/ExpiredTasks'
import { WarningCard } from './warning-card'

export const Main = () => {
  const user = useAppSelector(selectUser)
  const isStudent = user?.profession === Role.student
  console.log(isStudent)
  return (
    <>
      {isStudent ? (
        <div className={s.contentBlock}>
          <div className={s.tasks}>
            <CurrentTasks />
            <ExpiredTasks />
          </div>
          <WarningCard className={s.warning} />
          <Schedule />
        </div>
      ) : (
        <div className={s.contentBlock}>
          <Typography
            variant="header_6"
            children="Здесь будут отображены все курсы и все пользователи"
          />
        </div>
      )}
    </>
  )
}
