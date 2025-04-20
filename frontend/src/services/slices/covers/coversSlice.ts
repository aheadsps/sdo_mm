import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CoverCurrent, CoverShort } from '@services/api/types.api'
import { getDaysLeft } from '@shared/utils'

type InitialState = {
  covers: CoverShort[]
  coverId: number
  userCovers: CoverCurrent[]
  currentCovers: CoverCurrent[]
  expiringCovers: CoverCurrent[]
  expiredCovers: CoverCurrent[]
  completedCovers: CoverCurrent[]
  favoriteCovers: CoverCurrent[]
}
const initialState: InitialState = {
  covers: [],
  coverId: 0,
  userCovers: [],
  currentCovers: [],
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
      console.log(state.userCovers)
      state.expiringCovers = action.payload.filter(
        (result) =>
          getDaysLeft(result.event.end_date) <= 2 && getDaysLeft(result.event.end_date) >= 0
      )
      // console.log(state.expiringCovers)
      state.expiredCovers = action.payload.filter((result) => result.event.status === 'failed')
      // console.log(state.expiredCovers)
      state.favoriteCovers = action.payload.filter((result) => result.favorite)
      // console.log(state.favoriteCovers)
      state.completedCovers = action.payload.filter((result) => result.procent === 100)
    },

    setCoverId: (state, action: PayloadAction<number>) => {
      state.coverId = action.payload
    },
    clearUserCovers: (state) => {
      state.currentCovers = []
      state.expiringCovers = []
      state.expiredCovers = []
      state.completedCovers = []
      state.favoriteCovers = []
    },
  },
  selectors: {
    selectAllCovers: (state) => state.covers,
    selectUserCovers: (state) => state.userCovers,
    selectCurrentCovers: (state) => state.currentCovers,
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
  selectCurrentCovers,
  selectExpiringCovers,
  selectExpiredCovers,
  selectCompletedCovers,
  selectFavoriteCovers,
  selectCoverId,
} = coversSlice.selectors

export const coversSliceReducer = coversSlice.reducer
