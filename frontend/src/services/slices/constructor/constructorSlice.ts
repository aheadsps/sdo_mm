import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { LessonType, Step } from '@services/api'

import { NewItem } from './constructor.types'

type InitialState = {
  activeBlockId: number | null
  currentLesson: LessonType | null
  currentSteps: Step[]
}

const initialState: InitialState = {
  activeBlockId: 1,
  currentLesson: null,
  currentSteps: [],
}

export const constructorSlice = createSlice({
  name: 'add',
  initialState,
  reducers: {
    addNewBlock: (state, action: PayloadAction<Step>) => {
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
    setCurrentLesson: (state, action: PayloadAction<LessonType>) => {
      state.currentLesson = action.payload
    },
    setCurrentSteps: (state, action: PayloadAction<Step[]>) => {
      state.currentSteps = action.payload.map((item) => ({ ...item, blockItems: [] }))
    },
  },
  selectors: {
    selectActiveBlockId: (sliceState) => sliceState.activeBlockId,
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
  setCurrentLesson,
  setCurrentSteps,
} = constructorSlice.actions
export const { selectActiveBlockId, selectCurrentLesson, selectCurrentSteps } =
  constructorSlice.selectors
export const constructorSliceReducer = constructorSlice.reducer
