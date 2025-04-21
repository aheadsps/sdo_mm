import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { LessonType, StepView } from '@services/api'

import { NewItem } from './constructor.types'

type InitialState = {
  activeBlockId: number | null
  currentLessons: LessonType[]
  currentLesson: LessonType | null
  currentSteps: StepView[]
}

const initialState: InitialState = {
  activeBlockId: 1,
  currentLessons: [],
  currentLesson: null,
  currentSteps: [],
}

export const constructorSlice = createSlice({
  name: 'add',
  initialState,
  reducers: {
    addNewBlock: (state, action: PayloadAction<StepView>) => {
      state.currentSteps.push(action.payload)
    },
    addNewBlockItem: (state, action: PayloadAction<{ newItem: NewItem; blockId: number }>) => {
      const block = state.currentSteps.find((b) => b.id === action.payload.blockId)
      if (block) {
        block.blockItems.push(action.payload.newItem)
      }
    },
    deleteBlockItem: (state, action: PayloadAction<{ blockId: number }>) => {
      state.currentSteps = state.currentSteps.filter((block) => block.id !== action.payload.blockId)
    },
    setActiveBlockId: (state, action: PayloadAction<{ blockId: number | null }>) => {
      state.activeBlockId = action.payload.blockId
    },
    deleteItem: (state, action: PayloadAction<{ itemId: number; activeBlockId: number }>) => {
      const { itemId, activeBlockId } = action.payload

      state.currentSteps = state.currentSteps.map((block) => {
        if (block.id !== activeBlockId) return block

        return {
          ...block,
          blockItems: block.blockItems.filter((item) => item.id !== itemId),
        }
      })
    },
    setCurrentLessons: (state, action: PayloadAction<{ lessons: LessonType[]; id: number }>) => {
      state.currentLessons = action.payload.lessons.map((lesson) =>
        lesson.id === action.payload.id ? { ...lesson, expanded: !lesson.expanded } : lesson
      )
    },
    setCurrentLesson: (state, action: PayloadAction<LessonType>) => {
      state.currentLesson = action.payload
    },
    setCurrentSteps: (state, action: PayloadAction<StepView[]>) => {
      state.currentSteps = action.payload.map((item) => ({ ...item, blockItems: [] }))
    },

    addLesson: (state, action: PayloadAction<{ name: string; id: number; courseId: number }>) => {
      const { name, id, courseId } = action.payload

      const newLesson: LessonType = {
        id,
        name,
        course: courseId,
        resource: null,
        serial: 1,
        start_date: new Date().toISOString(),
        started: false,
        steps: [],
        teacher: 1,
        test_block: 0,
        version: null,
        expanded: false,
      }

      state.currentLesson = newLesson
      state.currentLessons.push(newLesson)
    },
  },
  selectors: {
    selectActiveBlockId: (sliceState) => sliceState.activeBlockId,
    selectCurrentLessons: (sliceState) => sliceState.currentLessons,
    selectCurrentLesson: (sliceState) => sliceState.currentLesson,
    selectCurrentSteps: (sliceState) => sliceState.currentSteps,
  },
})

export const {
  addNewBlock,
  addNewBlockItem,
  deleteBlockItem,
  setActiveBlockId,
  deleteItem,
  setCurrentLessons,
  setCurrentLesson,
  setCurrentSteps,
  addLesson,
} = constructorSlice.actions
export const {
  selectActiveBlockId,
  selectCurrentLessons,
  selectCurrentLesson,
  selectCurrentSteps,
} = constructorSlice.selectors
export const constructorSliceReducer = constructorSlice.reducer
