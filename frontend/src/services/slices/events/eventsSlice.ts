import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Event, EventShort } from '@services/api'
import { getDaysLeft } from '@shared/utils'

type InitialState = {
  events: EventShort[]
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
      user: 0,
      interval: '',
      create_date: '',
      update_date: '',
      description: '',
      lessons: [],
      beginner: false,
      image: '',
      profession: { id: 0, en_name: '', ru_name: '' },
      scorms: [],
      experiences: [],
      teacher: 0,
      materials: {
        id: 0,
        files: [],
      },
      status: '',
      is_scorm: false,
    },
    start_date: '',
    end_date: '',
    status: '',
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
    // Поле favorite существует только в сущности Cover
    // setFavoriteEvents: (state, action: PayloadAction<Event[]>) => {
    //   state.favoriteEvents = action.payload.filter((result) => result.favorite)
    // },
    setAllEvents: (state, action: PayloadAction<EventShort[]>) => {
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
    },
  },
  selectors: {
    selectAllEvents: (state) => state.events,
    selectCurrentEvents: (state) => state.currentEvents,
    selectExpiringEvents: (state) => state.expiringEvents,
    selectExpiredEvents: (state) => state.expiredEvents,
    selectCompletedEvents: (state) => state.completedEvents,
    selectEvent: (state) => state.event,
  },
})

export const { setCurrentEvents, clearCurrentEvents, setEvent, setAllEvents } = eventsSlice.actions
export const {
  selectAllEvents,
  selectCurrentEvents,
  selectExpiringEvents,
  selectExpiredEvents,
  selectCompletedEvents,
  selectEvent,
} = eventsSlice.selectors

export const eventsSliceReducer = eventsSlice.reducer
