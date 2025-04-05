import { useGetCurrentEventsQuery } from '@services/events'
import { setCurrentEvents } from '@services/events/eventsSlice'
import { useAppDispatch } from '@services/store'
import { Calendar, Loader } from '@shared/components'
import { useEffect } from 'react'

import s from './main.module.scss'
import { CurrentTasks } from './tasks-elements/CurrentTasks'
import { ExpiredTasks } from './tasks-elements/ExpiredTasks'
import { WarningCard } from './warning-card'

export const Main = () => {
  const { data: events, isLoading } = useGetCurrentEventsQuery()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (events?.results) {
      dispatch(setCurrentEvents(events?.results))
    }
  }, [events?.results, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={s.contentBlock}>
      <div className={s.tasks}>
        <CurrentTasks />
        <ExpiredTasks />
      </div>
      <div className={s.warning}>
        <WarningCard />
      </div>
      <Calendar />
    </div>
  )
}
