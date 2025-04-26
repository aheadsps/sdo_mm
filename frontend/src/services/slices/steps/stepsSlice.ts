import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Step, StepShort } from '@services/api'

type InitialState = {
  steps: StepShort[]
  step: Step
}
const initialState: InitialState = {
  steps: [],
  step: {
    title: '',
    teacher: 0,
    content_text: '',
    serial: 0,
    lesson: 0,
    attachments: [],
  },
}
export const stepsSlice = createSlice({
  name: 'steps',
  initialState,
  reducers: {
    setAllsteps: (state, action: PayloadAction<StepShort[]>) => {
      state.steps = action.payload
    },
    setStepById: (state, action: PayloadAction<Step>) => {
      state.step = action.payload
    },
  },
  selectors: {
    selectsteps: (state) => state.steps,
    selectStepById: (state) => state.step,
  },
})

export const { setAllsteps, setStepById } = stepsSlice.actions
export const { selectsteps, selectStepById } = stepsSlice.selectors

export const stepsSliceReducer = stepsSlice.reducer
