import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Course, CourseVeiw } from '@services/api/types'

type InitialState = {
  covers: Course[]
  coverId: number
  currentCovers: CourseVeiw[]
}
const initialState: InitialState = {
  covers: [],
  coverId: 0,
  currentCovers: [
    {
      beginer: false,
      create_date: '',
      description: '',
      experiences: [],
      id: 0,
      image: '',
      lessons: [],
      name: '',
      profession: 0,
      update_date: '',
      scorms: [],
      lesson_story: [],
    },
  ],
}

export const coversSlice = createSlice({
  name: 'covers',
  initialState,
  reducers: {
    setAllCovers: (state, action: PayloadAction<Course[]>) => {
      state.covers = action.payload
    },
    setCurrentCovers: (state, action: PayloadAction<CourseVeiw[]>) => {
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
