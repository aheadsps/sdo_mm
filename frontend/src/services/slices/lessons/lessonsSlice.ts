import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Lesson, Scorm } from '@services/api'

type InitialState = {
  lessons: Lesson[]
  scorm: Scorm
}
const initialState: InitialState = {
  lessons: [],
  scorm: {
    id: 0,
    name: '',
    course: 0,
    version: '',
    resource: '',
  },
}
export const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setAllLessons: (state, action: PayloadAction<Lesson[]>) => {
      state.lessons = action.payload
    },
    setScormById: (state, action: PayloadAction<Scorm>) => {
      state.scorm = action.payload
    },
  },
  selectors: {
    selectLessons: (state) => state.lessons,
    selectScormById: (state) => state.scorm,
  },
})

export const { setAllLessons, setScormById } = lessonsSlice.actions
export const { selectLessons, selectScormById } = lessonsSlice.selectors

export const lessonsSliceReducer = lessonsSlice.reducer
