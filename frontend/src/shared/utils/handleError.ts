import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

type CustomError = {
  detail: string
}

export const handleError = (error: FetchBaseQueryError | SerializedError) => {
  if ('status' in error) {
    //  FetchBaseQueryError
    if (error.data && typeof error.data === 'object' && 'detail' in error.data) {
      return (error.data as CustomError).detail
    } else {
      return error.data
    }
  } else {
    // SerializedError
    return error.message || 'An unknown error occurred.'
  }
}
