import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Course, CourseShort } from '@services/api/types.api'

type InitialState = {
  courses: CourseShort[]
  currentId: number
  course: Course
}
const initialState: InitialState = {
  courses: [],
  currentId: 0,
  course: {
    beginer: false,
    create_date: '',
    description: '',
    id: 0,
    image: '',
    lessons: [],
    name: '',
    profession: {
      id: 0,
      en_name: '',
      ru_name: '',
    },
    update_date: '',
    scorms: [],
    teacher: 0,
    interval: '',
    experiences: [],
    materials: {
      id: 0,
      files: [],
    },
    status: '',
    is_scorm: false,
  },
  // userCourse: {
  //   id: 0,
  //   teacher: 0,
  //   name: '',
  //   description: '',
  //   interval: '',
  //   lessons: [],
  //   beginner: false,
  //   image: '',
  //   profession: 0,
  //   experiences: [],
  //   materials: {
  //     id: 0,
  //     files: [],
  //   },
  //   status: '',
  //   is_scorm: false,
  // },
}

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setAllCourses: (state, action: PayloadAction<CourseShort[]>) => {
      state.courses = action.payload
    },
    setCourseById: (state, action: PayloadAction<Course>) => {
      state.course = action.payload
    },
    setCurrentId: (state, action: PayloadAction<number>) => {
      state.currentId = action.payload
    },
    // setUserCourse: (state, action: PayloadAction<CourseShort>) => {
    //   state.userCourse = action.payload
    // },
  },
  selectors: {
    selectCourses: (state) => state.courses,
    selectCurrentId: (state) => state.currentId,
    selectCourse: (state) => state.course,
    // selectUserCourse: (state) => state.userCourse,
  },
})

export const { setAllCourses, setCourseById, setCurrentId } = coursesSlice.actions
export const { selectCourses, selectCourse, selectCurrentId } = coursesSlice.selectors

export const coursesSliceReducer = coursesSlice.reducer
