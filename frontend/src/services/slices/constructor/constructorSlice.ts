import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { LessonBlock } from './constructor.types'
import { NewItem } from './constructor.types'

type InitialState = {
  lessonBlocks: LessonBlock[]
}

const initialState: InitialState = {
  lessonBlocks: [],
}

export const constructorSlice = createSlice({
  name: 'add',
  initialState,
  reducers: {
    setBlocks: (state, action: PayloadAction<LessonBlock[]>) => {
      state.lessonBlocks = action.payload
    },
    addNewBlockItem: (state, action: PayloadAction<{ newItem: NewItem; blockId: number }>) => {
      const block = state.lessonBlocks.find((b) => b.id === action.payload.blockId)
      if (block) {
        block.blockItems.push(action.payload.newItem)
      }
    },
    deleteBlockItem: (state, action: PayloadAction<{ blockId: number }>) => {
      state.lessonBlocks = state.lessonBlocks.filter((block) => block.id !== action.payload.blockId)
    },
  },
  selectors: {
    selectBlocks: (sliceState) => sliceState.lessonBlocks,
  },
})

export const { setBlocks, addNewBlockItem, deleteBlockItem } = constructorSlice.actions
export const { selectBlocks } = constructorSlice.selectors
export const constructorSliceReducer = constructorSlice.reducer
