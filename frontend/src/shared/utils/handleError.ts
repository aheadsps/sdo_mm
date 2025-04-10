import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

type CustomError = {
  detail: string
}
/**
 * this function handles api errors.
 *
 * @param {FetchBaseQueryError | SerializedError} error - The error object returned from the RTK Query API.
 *   - This can be either a `FetchBaseQueryError` (which represents errors from network issues or server responses)
 *     or a `SerializedError` (which represents errors from invalid responses or client-side issues).
 * @returns {string} - A user-friendly error message.
 *
 * @description
 * This function checks the type of error:
 * - For network errors it returns a message indicating a connection issue.
 * - For API errors with a 'detail' field in the response data, it returns the detail message.
 * - If the error is a SerializedError (such as an invalid response), it returns the error message.
 */

export const handleError = (error: FetchBaseQueryError | SerializedError): string => {
  if ('status' in error) {
    if (error.data && typeof error.data === 'object' && 'detail' in error.data) {
      return (error.data as CustomError).detail
    }
    return 'Network error'
  } else {
    return error.message || 'An unknown error occurred.'
  }
}
