import { CoverCurrent, EventShort } from '@services/api'
import { useGetProfileQuery } from '@services/api'
import { setAllEvents, setUserCovers } from '@services/slices'
import { setUser } from '@services/slices'
import { useAppDispatch } from '@services/store'
import { Header, Loader, Sidebar, Typography } from '@shared/components'
import { Role } from '@shared/components/sidebar/sidebar.types'
import { useScreenWidth } from '@shared/hooks'
import { handleError } from '@shared/utils'
import { ComponentType, useEffect } from 'react'

import { useFetchData } from '../useFetchData'

import s from './layout.module.scss'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const { data: profile, isLoading: isProfileLoading, error: profileError } = useGetProfileQuery()

    const role = profile?.profession ?? null
    const { events, currentCovers, isLoading, error } = useFetchData(role)

    const { isMobile } = useScreenWidth()
    const dispatch = useAppDispatch()

    useEffect(() => {
      if (profile) {
        localStorage.setItem('role', JSON.stringify(profile.profession))
        dispatch(setUser(profile))
      }
    }, [dispatch, profile])

    useEffect(() => {
      if (role === Role.student && currentCovers?.results) {
        dispatch(setUserCovers(currentCovers?.results as CoverCurrent[]))
      }
      dispatch(setAllEvents(events?.results as EventShort[]))
    }, [dispatch, currentCovers?.results, events?.results, role])

    return (
      <>
        <Header isLoading={isProfileLoading} />
        <div className={s.appWrapper}>
          {!isMobile && <Sidebar isLoading={isProfileLoading} error={profileError} />}
          <main>
            <div className={s.main}>{isLoading ? <Loader /> : <Component {...props} />}</div>
            {error && <Typography variant="body_1">{handleError(error)}</Typography>}
          </main>
        </div>
      </>
    )
  }
}
