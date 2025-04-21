import { useLazyGetCurrentCoversQuery, useLazyGetEventsQuery } from '@services/api'
import { setAllEvents, setUserCovers } from '@services/slices'
import { useAppDispatch } from '@services/store'
import { Header, Loader, Sidebar } from '@shared/components'
import { useScreenWidth } from '@shared/hooks'
import { handleError } from '@shared/utils'
import { ComponentType, useEffect, useState } from 'react'

import s from './layout.module.scss'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { isMobile } = useScreenWidth()
    const dispatch = useAppDispatch()
    const [getEvents] = useLazyGetEventsQuery()
    useEffect(() => {
      getEvents()
        .unwrap()
        .then((res) => {
          // console.log(res.results)
          dispatch(setAllEvents(res.results))
        })
        .catch((error) => handleError(error))
        .finally(() => setIsLoading(false))
    }, [getEvents, dispatch])

    const [getCurrentCovers] = useLazyGetCurrentCoversQuery()
    useEffect(() => {
      getCurrentCovers('')
        .unwrap()
        .then((res) => {
          dispatch(setUserCovers(res.results))
        })
        .catch((error) => handleError(error))
        .finally(() => setIsLoading(false))
    }, [getCurrentCovers, dispatch])
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
