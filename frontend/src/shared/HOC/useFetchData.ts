import { useLazyGetCurrentCoversQuery, useLazyGetEventsQuery } from '@services/api'
import { setAllEvents, setUserCovers } from '@services/slices'
import { useAppDispatch } from '@services/store'
import { useScreenWidth } from '@shared/hooks'
import { handleError } from '@shared/utils'
import { useState, useEffect } from 'react'

export const useFetchData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isMobile } = useScreenWidth()
  const dispatch = useAppDispatch()
  const [getEvents] = useLazyGetEventsQuery()
  const [getCurrentCovers] = useLazyGetCurrentCoversQuery()

  useEffect(() => {
    getEvents()
      .unwrap()
      .then((res) => {
        dispatch(setAllEvents(res.results))
      })
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false))
  }, [getEvents, dispatch])

  useEffect(() => {
    getCurrentCovers('')
      .unwrap()
      .then((res) => {
        dispatch(setUserCovers(res.results))
      })
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false))
  }, [getCurrentCovers, dispatch])

  return {
    isMobile,
    isLoading,
  }
}
