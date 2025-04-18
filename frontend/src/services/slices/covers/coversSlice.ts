import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CoverCurrent } from '@services/api/types.api'

type InitialState = {
  covers: CoverCurrent[]
  coverId: number
  currentCovers: CoverCurrent[]
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
    setAllCovers: (state, action: PayloadAction<CoverCurrent[]>) => {
      state.covers = action.payload
    },
    setCurrentCovers: (state, action: PayloadAction<CoverCurrent[]>) => {
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
