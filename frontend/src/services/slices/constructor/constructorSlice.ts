import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { LessonBlock } from './constructor.types'
import { NewItem } from './constructor.types'

type InitialState = {
  lessonBlocks: LessonBlock[]
  activeBlockId: number
}

const initialState: InitialState = {
  lessonBlocks: [],
  activeBlockId: 1,
}

export const constructorSlice = createSlice({
  name: 'add',
  initialState,
  reducers: {
    setBlocks: (state, action: PayloadAction<LessonBlock[]>) => {
      state.lessonBlocks = action.payload
    },
    addNewBlock: (state, action: PayloadAction<LessonBlock>) => {
      state.lessonBlocks.push(action.payload)
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

    setActiveBlockId: (state, action: PayloadAction<{ blockId: number }>) => {
      state.activeBlockId = action.payload.blockId
    },
    deleteItem: (state, action: PayloadAction<{ itemId: number; activeBlockId: number }>) => {
      const { itemId, activeBlockId } = action.payload

      state.lessonBlocks = state.lessonBlocks.map((block) => {
        if (block.id !== activeBlockId) return block

        return {
          ...block,
          blockItems: block.blockItems.filter((item) => item.id !== itemId),
        }
      })
    },
  },
  selectors: {
    selectBlocks: (sliceState) => sliceState.lessonBlocks,
    selectActiveBlockId: (sliceState) => sliceState.activeBlockId,
  },
})

export const {
  setBlocks,
  addNewBlock,
  addNewBlockItem,
  deleteBlockItem,
  setActiveBlockId,
  deleteItem,
} = constructorSlice.actions
export const { selectBlocks, selectActiveBlockId } = constructorSlice.selectors
export const constructorSliceReducer = constructorSlice.reducer
