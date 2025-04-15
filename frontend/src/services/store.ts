import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import { authApi, coursesApi, coversApi, eventsApi } from './api'
import { authReducer, coursesSliceReducer, coversSliceReducer } from './slices'
import { auxiliarySliceReducer } from './slices/auxiliarySlice'
import { eventsSliceReducer } from './slices/events/eventsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    covers: coversSliceReducer,
    courses: coursesSliceReducer,
    events: eventsSliceReducer,
    auxiliary: auxiliarySliceReducer,
    [authApi.reducerPath]: authApi.reducer,
    [coversApi.reducerPath]: coversApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    // [authApi.reducerPath]: authApi.reducer,
    // [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      coversApi.middleware,
      eventsApi.middleware,
      coursesApi.middleware
      // authApi.middleware,
      // authApi.middleware,
      // authApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
