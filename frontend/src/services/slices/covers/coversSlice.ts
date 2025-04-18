import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Course } from '@services/api/types'
import { EventShort } from '@services/api/types.api'

type InitialState = {
  covers: Course[]
  coverId: number
  currentCovers: EventShort[]
}
const initialState: InitialState = {
  covers: [],
  coverId: 0,
  currentCovers: [],
}

export const coversSlice = createSlice({
  name: 'covers',
  initialState,
  reducers: {
    setAllCovers: (state, action: PayloadAction<Course[]>) => {
      state.covers = action.payload
    },
    setCurrentCovers: (state, action: PayloadAction<EventShort[]>) => {
      state.currentCovers = action.payload
    },
    setCoverId: (state, action: PayloadAction<number>) => {
      state.coverId = action.payload
    },
  },
  selectors: {
    selectCovers: (state) => state.covers,
    selectCurrentCovers: (state) => state.currentCovers,
    selectCoverId: (state) => state.coverId,
  },
})

export const { setAllCovers, setCurrentCovers, setCoverId } = coversSlice.actions
export const { selectCovers, selectCurrentCovers, selectCoverId } = coversSlice.selectors

export const coversSliceReducer = coversSlice.reducer
