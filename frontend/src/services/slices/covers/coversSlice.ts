import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CoverCurrent, CoverShort } from '@services/api/types.api'
import { getDaysLeft } from '@shared/utils'

type InitialState = {
  covers: CoverShort[]
  coverId: number
  userCovers: CoverCurrent[]
  expiringCovers: CoverCurrent[]
  expiredCovers: CoverCurrent[]
  completedCovers: CoverCurrent[]
  favoriteCovers: CoverCurrent[]
}
const initialState: InitialState = {
  covers: [],
  coverId: 0,
  userCovers: [],
  expiringCovers: [],
  expiredCovers: [],
  completedCovers: [],
  favoriteCovers: [],
}

export const coversSlice = createSlice({
  name: 'covers',
  initialState,
  reducers: {
    setAllCovers: (state, action: PayloadAction<CoverShort[]>) => {
      state.covers = action.payload
    },
    setUserCovers: (state, action: PayloadAction<CoverCurrent[]>) => {
      state.userCovers = action.payload
      state.expiringCovers = action.payload.filter(
        (result) =>
          getDaysLeft(result.event.end_date) <= 2 && getDaysLeft(result.event.end_date) >= 0
      )
      state.expiredCovers = action.payload.filter((result) => result.event.status === 'failed')
      state.favoriteCovers = action.payload.filter((result) => result.favorite)
      state.completedCovers = action.payload.filter((result) => result.event.status === 'done')
    },

    setCoverId: (state, action: PayloadAction<number>) => {
      state.coverId = action.payload
    },
    clearUserCovers: (state) => {
      state.expiringCovers = []
      state.expiredCovers = []
      state.completedCovers = []
      state.favoriteCovers = []
    },
  },
  selectors: {
    selectAllCovers: (state) => state.covers,
    selectUserCovers: (state) => state.userCovers,
    selectExpiringCovers: (state) => state.expiringCovers,
    selectExpiredCovers: (state) => state.expiredCovers,
    selectCompletedCovers: (state) => state.completedCovers,
    selectFavoriteCovers: (state) => state.favoriteCovers,
    selectCoverId: (state) => state.coverId,
  },
})

export const { setAllCovers, setUserCovers, clearUserCovers, setCoverId } = coversSlice.actions
export const {
  selectAllCovers,
  selectUserCovers,
  selectExpiringCovers,
  selectExpiredCovers,
  selectCompletedCovers,
  selectFavoriteCovers,
  selectCoverId,
} = coversSlice.selectors

export const coversSliceReducer = coversSlice.reducer
