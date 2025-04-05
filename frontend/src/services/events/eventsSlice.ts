import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getDaysLeft } from '@shared/utils'

import { Event } from './events.types'

type InitialState = {
  currentEvents: Event[]
  expiringEvents: Event[]
  expiredEvents: Event[]
}
const initialState: InitialState = {
  currentEvents: [],
  expiringEvents: [],
  expiredEvents: [],
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setCurrentEvents: (state, action: PayloadAction<Event[]>) => {
      state.currentEvents = action.payload
      state.expiringEvents = action.payload.filter(
        (result) => getDaysLeft(result.end_date) <= 2 && getDaysLeft(result.end_date) >= 0
      )
      state.expiredEvents = action.payload.filter((result) => result.status === 'failed')
    },

    clearCurrentEvents: (state) => {
      state.currentEvents = []
      state.expiringEvents = []
      state.expiredEvents = []
    },
  },
  selectors: {
    selectCurrentEvents: (state) => state.currentEvents,
    selectExpiringEvents: (state) => state.expiringEvents,
    selectExpiredEvents: (state) => state.expiredEvents,
  },
})

export const { setCurrentEvents, clearCurrentEvents } = eventsSlice.actions
export const { selectCurrentEvents, selectExpiringEvents, selectExpiredEvents } =
  eventsSlice.selectors

export const eventsSliceReducer = eventsSlice.reducer
