import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Event } from '@services/api'
import { EventShort } from '@services/api/types.api'
import { getDaysLeft } from '@shared/utils'

type InitialState = {
  events: Event[]
  currentEvents: Event[]
  expiringEvents: Event[]
  expiredEvents: Event[]
  completedEvents: Event[]
  favoriteEvents: Event[]

  event: Event
}
const initialState: InitialState = {
  events: [],
  currentEvents: [],
  expiringEvents: [],
  expiredEvents: [],
  completedEvents: [],
  favoriteEvents: [],
  event: {
    course: {
      id: 0,
      name: '',
      create_date: '',
      update_date: '',
      description: '',
      lessons: [],
      beginer: false,
      image: '',
      profession: 0,
      scorms: [],
      experiences: [],
    },
    done_lessons: 0,
    end_date: '',
    favorite: false,
    id: 0,
    start_date: '',
    status: '',
    user: 0,
  },
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

    setFavoriteEvents: (state, action: PayloadAction<Event[]>) => {
      state.favoriteEvents = action.payload.filter((result) => result.favorite)
    },

    setAllEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload
    },
    setEvent: (state, action: PayloadAction<Event>) => {
      state.event = action.payload
    },

    clearCurrentEvents: (state) => {
      state.currentEvents = []
      state.expiringEvents = []
      state.expiredEvents = []
      state.completedEvents = []
      state.favoriteEvents = []
    },
  },
  selectors: {
    selectAllEvents: (state) => state.events,
    selectCurrentEvents: (state) => state.currentEvents,
    selectExpiringEvents: (state) => state.expiringEvents,
    selectExpiredEvents: (state) => state.expiredEvents,
    selectCompletedEvents: (state) => state.completedEvents,
    selectFavoriteEvents: (state) => state.favoriteEvents,
    selectEvent: (state) => state.event,
  },
})

export const { setCurrentEvents, clearCurrentEvents, setAllEvents, setEvent } = eventsSlice.actions
export const {
  selectAllEvents,
  selectCurrentEvents,
  selectExpiringEvents,
  selectExpiredEvents,
  selectFavoriteEvents,
  selectCompletedEvents,
  selectEvent,
} = eventsSlice.selectors

export const eventsSliceReducer = eventsSlice.reducer
