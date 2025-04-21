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
    resource: '',
    serial: 0,
    start_date: '',
    started: false,
    steps: [],
    teacher: 0,
    test_block: 0,
    version: '',
    //Дописала свойство, которого нет в моём типе
    expanded: false,
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
    setLessonById: (state, action: PayloadAction<Lesson>) => {
      state.lesson = action.payload
    },
    setScormById: (state, action: PayloadAction<Scorm>) => {
      state.scorm = action.payload
    },
  },
  selectors: {
    selectLessons: (state) => state.lessons,
    selectScormById: (state) => state.scorm,
    selectLessonById: (state) => state.lesson,
  },
})

export const { setAllLessons, setScormById, setLessonById } = lessonsSlice.actions
export const { selectLessons, selectScormById, selectLessonById } = lessonsSlice.selectors

export const lessonsSliceReducer = lessonsSlice.reducer
