import { useGetCurrentCoversQuery, useGetEventsQuery } from '@services/api'
import { Role } from '@shared/components/sidebar/sidebar.types'

export const useFetchData = (role: Role | null) => {
  const isStudent = role === Role.student

  const { data: events, isLoading: isEventsLoading, error: eventsError } = useGetEventsQuery()

  const {
    data: currentCovers,
    isLoading: isCurrentCoversLoading,
    error: currentCoversError,
  } = useGetCurrentCoversQuery('', {
    skip: !isStudent,
  })

  return {
    events,
    currentCovers,
    isLoading: isStudent ? isCurrentCoversLoading : isEventsLoading,
    error: isStudent ? currentCoversError : eventsError,
  }
}
