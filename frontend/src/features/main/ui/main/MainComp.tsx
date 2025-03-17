import { WarningCard } from '../warning-card'

import s from './main.module.scss'
import { AssignedCourses } from './tasks-elements/AssignedCourses'
import { CurrentTasks } from './tasks-elements/CurrentTasks'
import { ExpiredTasks } from './tasks-elements/ExpiredTasks'

export const MainComp = () => {
  return (
    <div className={s.contentBlock}>
      <div className={s.tasks}>
        <CurrentTasks />
        <ExpiredTasks />
      </div>
      <div className={s.rightBlock}>
        <WarningCard />
        <AssignedCourses />
      </div>
    </div>
  )
}
