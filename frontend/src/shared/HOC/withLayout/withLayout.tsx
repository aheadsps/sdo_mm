import { useGetUserCurrentEventsQuery } from '@services/api'
import { setCurrentEvents } from '@services/slices/events'
import { useAppDispatch } from '@services/store'
import { Header, Loader, Sidebar } from '@shared/components'
import { useScreenWidth } from '@shared/hooks'
import { ComponentType, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import s from './layout.module.scss'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const path = useLocation()
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
        {path.pathname.includes('/constructor') ? (
          <div className={s.constructorWrapper}>
            {isLoading ? <Loader /> : <Component {...props} />}
          </div>
        ) : (
          <div className={s.appWrapper}>
            {!isMobile && <Sidebar />}
            <main>
              <div className={s.main}>{isLoading ? <Loader /> : <Component {...props} />}</div>
            </main>
          </div>
        )}
      </>
    )
  }
}
