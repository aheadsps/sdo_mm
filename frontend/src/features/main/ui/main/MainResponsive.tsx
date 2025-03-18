import { WarningCard } from '../warning-card'

import s from './main.module.scss'
import { AssignedCourses, CurrentTasks, ExpiredTasks } from './tasks-elements'

export const MainResponsive = () => {
  return (
    <div className={s.responsive}>
      <WarningCard />
      <CurrentTasks />
      <ExpiredTasks />
      <AssignedCourses />
    </div>
  )
}
