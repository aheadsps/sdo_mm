import { useGetCurrentEventsQuery, setCurrentEvents } from '@services/events'
import { useAppDispatch } from '@services/store'
import { Header, Loader, Sidebar } from '@shared/components'
import { useScreenWidth } from '@shared/hooks'
import { ComponentType } from 'react'
import { useEffect } from 'react'

import s from './layout.module.scss'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const { isMobile } = useScreenWidth()

    const { data: events, isLoading } = useGetCurrentEventsQuery()
    const dispatch = useAppDispatch()

    useEffect(() => {
      if (events?.results) {
        dispatch(setCurrentEvents(events?.results))
      }
    }, [events?.results, dispatch])

    return (
      <>
        <Header />
        <div className={s.appWrapper}>
          {!isMobile && <Sidebar />}
          <main className={s.main}>{isLoading ? <Loader /> : <Component {...props} />}</main>
        </div>
      </>
    )
  }
}
