import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import { authApi, coursesApi, coversApi, eventsApi, lessonsApi, testsApi } from './api'
import { stepsApi } from './api/steps.api'
import { authReducer, coursesSliceReducer, coversSliceReducer } from './slices'
import { auxiliarySliceReducer } from './slices/auxiliarySlice'
import { constructorSliceReducer } from './slices/constructor/constructorSlice'
import { eventsSliceReducer } from './slices/events/eventsSlice'
import { lessonsSliceReducer } from './slices/lessons/lessonsSlice'
import { stepsSliceReducer } from './slices/steps'
import { testsSliceReducer } from './slices/tests'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    covers: coversSliceReducer,
    courses: coursesSliceReducer,
    events: eventsSliceReducer,
    auxiliary: auxiliarySliceReducer,
    lessons: lessonsSliceReducer,
    steps: stepsSliceReducer,
    tests: testsSliceReducer,
    add: constructorSliceReducer,
    [authApi.reducerPath]: authApi.reducer,
    [coversApi.reducerPath]: coversApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
    [stepsApi.reducerPath]: stepsApi.reducer,
    [testsApi.reducerPath]: testsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      coversApi.middleware,
      eventsApi.middleware,
      coursesApi.middleware,
      lessonsApi.middleware,
      stepsApi.middleware,
      testsApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
