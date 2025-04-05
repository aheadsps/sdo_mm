import { useGetCurrentEventsQuery } from '@services/events'
import { Calendar, Loader } from '@shared/components'
import { getDaysLeft } from '@shared/utils'
import { useMemo } from 'react'

import s from './main.module.scss'
import { CurrentTasks } from './tasks-elements/CurrentTasks'
import { ExpiredTasks } from './tasks-elements/ExpiredTasks'
import { WarningCard } from './warning-card'

export const Main = () => {
  const { data: events, isLoading } = useGetCurrentEventsQuery()
  console.log(events?.results)

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

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={s.contentBlock}>
      <div className={s.tasks}>
        <CurrentTasks currentEvents={events?.results} />
        <ExpiredTasks failedEvents={failedEvents} />
      </div>
      <div className={s.warning}>
        <WarningCard expiringEvents={expiringEvents} />
      </div>
      <Calendar />
    </div>
  )
}
