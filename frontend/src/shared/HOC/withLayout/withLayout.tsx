import { useLazyGetUserCurrentEventsQuery } from '@services/api'
import { setCurrentEvents } from '@services/slices/events'
import { useAppDispatch } from '@services/store'
import { Header, Loader, Sidebar } from '@shared/components'
import { useScreenWidth } from '@shared/hooks'
import { handleError } from '@shared/utils'
import { ComponentType, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import s from './layout.module.scss'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const [isLoading, setisLoading] = useState<boolean>(true)
    const path = useLocation()
    const { isMobile } = useScreenWidth()
    const dispatch = useAppDispatch()

    // const [getUserCurrentEvents] = useLazyGetUserCurrentEventsQuery()
    // useEffect(() => {
    //   getUserCurrentEvents()
    //     .unwrap()
    //     .then((res) => dispatch(setCurrentEvents(res.results)))
    //     .catch((error) => handleError(error))
    //     .finally(() => setisLoading(false))
    // }, [getUserCurrentEvents, dispatch])

    const [getUserCurrentEvents] = useLazyGetUserCurrentEventsQuery()
    useEffect(() => {
      getUserCurrentEvents()
        .unwrap()
        .then((res) => dispatch(setCurrentEvents(res.results)))
        .catch((error) => handleError(error))
        .finally(() => setisLoading(false))
    }, [getUserCurrentEvents, dispatch])
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
