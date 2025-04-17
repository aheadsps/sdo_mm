import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import { authApi, coursesApi, coversApi, eventsApi, lessonsApi } from './api'
import { authReducer, coursesSliceReducer, coversSliceReducer } from './slices'
import { auxiliarySliceReducer } from './slices/auxiliarySlice'
import { userApi } from './api/user.api'
import { constructorSliceReducer } from './slices/constructor/constructorSlice'
import { eventsSliceReducer } from './slices/events/eventsSlice'
import { lessonsSliceReducer } from './slices/lessons/lessonsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    covers: coversSliceReducer,
    courses: coursesSliceReducer,
    events: eventsSliceReducer,
    auxiliary: auxiliarySliceReducer,
    lessons: lessonsSliceReducer,
    [authApi.reducerPath]: authApi.reducer,
    [coversApi.reducerPath]: coversApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
    // [authApi.reducerPath]: authApi.reducer,
    add: constructorSliceReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      coversApi.middleware,
      eventsApi.middleware,
      coursesApi.middleware,
      lessonsApi.middleware
      // authApi.middleware,
      // authApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
