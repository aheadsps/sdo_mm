import { useGetUserCurrentEventsQuery } from '@services/api'
import { setCurrentEvents } from '@services/slices/events'
import { useAppDispatch } from '@services/store'
import { Header, Loader, Sidebar } from '@shared/components'
import { useScreenWidth } from '@shared/hooks'
import { ComponentType, useEffect } from 'react'

import s from './layout.module.scss'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const { isMobile } = useScreenWidth()

    const { data: events, isLoading } = useGetUserCurrentEventsQuery()
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
          <main>
            <div className={s.main}>{isLoading ? <Loader /> : <Component {...props} />}</div>
          </main>
        </div>
      </>
    )
  }
}
