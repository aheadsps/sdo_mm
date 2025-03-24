import { Calendar } from '../../../shared/components/calendar/Calendar'
import s from './main.module.scss'
import { CurrentTasks } from './tasks-elements/CurrentTasks'
import { ExpiredTasks } from './tasks-elements/ExpiredTasks'
import { WarningCard } from './warning-card'

export const Main = () => {
  const hasWarning = true
  return (
    <div className={s.contentBlock}>
      <div className={s.tasks}>
        <CurrentTasks />
        <ExpiredTasks />
      </div>
      {hasWarning && (
        <div className={s.warning}>
          <WarningCard />
        </div>
      )}
      <Calendar />
    </div>
  )
}
