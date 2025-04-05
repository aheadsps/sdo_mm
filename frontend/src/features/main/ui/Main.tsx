import { useGetCurrentEventsQuery } from '@services/events'
import { Calendar } from '@shared/components'
import { getDaysLeft } from '@shared/utils'
import { useMemo } from 'react'

import s from './main.module.scss'
import { CurrentTasks } from './tasks-elements/CurrentTasks'
import { ExpiredTasks } from './tasks-elements/ExpiredTasks'
import { WarningCard } from './warning-card'

export const Main = () => {
  const { data: events } = useGetCurrentEventsQuery()
  console.log(events?.results)
  const hasWarning = true

  const failedEvents = useMemo(() => {
    return events?.results.filter((result) => result.status === 'failed') ?? []
  }, [events?.results])

  const expiringEvents = useMemo(() => {
    return (
      events?.results.filter(
        (result) => getDaysLeft(result.end_date) <= 2 && getDaysLeft(result.end_date) >= 0
      ) ?? []
    )
  }, [events?.results])

  return (
    <div className={s.contentBlock}>
      <div className={s.tasks}>
        <CurrentTasks currentEvents={events?.results} />
        <ExpiredTasks failedEvents={failedEvents} />
      </div>
      {hasWarning && (
        <div className={s.warning}>
          <WarningCard expiringEvents={expiringEvents} />
        </div>
      )}
      <Calendar />
    </div>
  )
}
