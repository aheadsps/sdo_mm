import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Lesson, LessonShort, Scorm } from '@services/api'

type InitialState = {
  lessons: LessonShort[]
  lesson: Lesson
  scorm: Scorm
}
const initialState: InitialState = {
  lessons: [],
  lesson: {
    course: 0,
    id: 0,
    name: '',
    resourse: '',
    serial: 0,
    start_date: '',
    started: false,
    steps: [],
    teacher: 0,
    test_block: 0,
    version: '',
  },
  scorm: {
    id: 0,
    name: '',
    teacher: 0,
    course: 0,
    version: '',
    resource: '',
  },
}
export const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setAllLessons: (state, action: PayloadAction<LessonShort[]>) => {
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
