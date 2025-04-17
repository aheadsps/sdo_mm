import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Course, CourseVeiw } from '@services/api/types'

type InitialState = {
  courses: Course[]
  currentId: number
  course: CourseVeiw
}
const initialState: InitialState = {
  courses: [],
  currentId: 0,
  course: {
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
}

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setAllCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload
    },
    setCourseById: (state, action: PayloadAction<CourseVeiw>) => {
      state.course = action.payload
    },
    setCurrentId: (state, action: PayloadAction<number>) => {
      state.currentId = action.payload
    },
  },
  selectors: {
    selectCourses: (state) => state.courses,
    selectCurrentId: (state) => state.currentId,
    selectCourse: (state) => state.course,
  },
})

export const { setAllCourses, setCourseById, setCurrentId } = coursesSlice.actions
export const { selectCourses, selectCourse, selectCurrentId } = coursesSlice.selectors

export const coursesSliceReducer = coursesSlice.reducer
