import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import { userApi } from './api/user.api'
import { authReducer } from './slices'
import { constructorSliceReducer } from './slices/constructor/constructorSlice'
import { eventsSliceReducer } from './slices/events/eventsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsSliceReducer,
    add: constructorSliceReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
