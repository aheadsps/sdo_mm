import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  currentCourseId: number
  currentCovereId: number
  currentEventId: number
  currentScorms: number[]
  currentLessonId: number
  currentStepId: number
  isScorms: boolean
}
const initialState: InitialState = {
  currentCourseId: 0,
  currentCovereId: 0,
  currentEventId: 0,
  currentScorms: [],
  currentLessonId: 0,
  currentStepId: 0,
  isScorms: false,
}

export const auxiliarySlice = createSlice({
  name: 'auxiliary',
  initialState,
  reducers: {
    setCurrentCourseId: (state, action: PayloadAction<number>) => {
      state.currentCourseId = action.payload
    },
    setCurrentCovereId: (state, action: PayloadAction<number>) => {
      state.currentCovereId = action.payload
    },
    setCurrentEventId: (state, action: PayloadAction<number>) => {
      state.currentEventId = action.payload
    },
    setCurrentScorms: (state, action: PayloadAction<number[]>) => {
      state.currentScorms = action.payload
    },
    setCurrentLessonId: (state, action: PayloadAction<number>) => {
      state.currentLessonId = action.payload
    },
    setCurrentStepId: (state, action: PayloadAction<number>) => {
      state.currentStepId = action.payload
    },
    setIsScorms: (state, action: PayloadAction<boolean>) => {
      state.isScorms = action.payload
    },
  },
  selectors: {
    selectCurrentCourseId: (state) => state.currentCourseId,
    selectCurrentCovereId: (state) => state.currentCovereId,
    selectCurrentEventId: (state) => state.currentEventId,
    selectCurrentScorms: (state) => state.currentScorms,
    selectCurrentLessonId: (state) => state.currentLessonId,
    selectCurrentStepId: (state) => state.currentStepId,
    selectIsScorms: (state) => state.isScorms,
  },
})

export const {
  setCurrentCourseId,
  setCurrentCovereId,
  setCurrentEventId,
  setCurrentScorms,
  setCurrentLessonId,
  setCurrentStepId,
  setIsScorms,
} = auxiliarySlice.actions
export const {
  selectCurrentCourseId,
  selectCurrentCovereId,
  selectCurrentEventId,
  selectCurrentScorms,
  selectCurrentLessonId,
  selectCurrentStepId,
  selectIsScorms,
} = auxiliarySlice.selectors

export const auxiliarySliceReducer = auxiliarySlice.reducer
