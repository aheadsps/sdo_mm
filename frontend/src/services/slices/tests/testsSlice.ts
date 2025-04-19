import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Answer, Question, Test } from '@services/api'

type InitialState = {
  tests: Test[]
  test: Test
  questions: Question[]
  question: Question
  answers: Answer[]
  answer: Answer
}
const initialState: InitialState = {
  tests: [],
  test: {
    id: 0,
    end_date: '',
    lesson: 0,
    max_score: 0,
    questions: [],
    user_story: [],
  },
  questions: [],
  question: {
    id: 0,
    text: '',
    image: '',
    test_block: 0,
    type_question: '',
    check_automaty: false,
    answers: [],
    teacher: 0,
  },
  answers: [],
  answer: {
    id: 0,
    text: '',
    correct: false,
    weight: 0,
    question: 0,
  },
}
export const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    setAllTests: (state, action: PayloadAction<Test[]>) => {
      state.tests = action.payload
    },
    setTestById: (state, action: PayloadAction<Test>) => {
      state.test = action.payload
    },
    setAllQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload
    },
    setQuestionById: (state, action: PayloadAction<Question>) => {
      state.question = action.payload
    },
    setAllAnswers: (state, action: PayloadAction<Answer[]>) => {
      state.answers = action.payload
    },
    setAnswerById: (state, action: PayloadAction<Answer>) => {
      state.answer = action.payload
    },
  },
  selectors: {
    selectTests: (state) => state.tests,
    selectTestById: (state) => state.test,
    selectQuestions: (state) => state.questions,
    selectQuestionById: (state) => state.questions,
    selectAnswers: (state) => state.answers,
    selectAnswerById: (state) => state.answer,
  },
})

export const {
  setAllTests,
  setTestById,
  setAllQuestions,
  setQuestionById,
  setAllAnswers,
  setAnswerById,
} = testsSlice.actions
export const {
  selectTests,
  selectTestById,
  selectQuestions,
  selectQuestionById,
  selectAnswers,
  selectAnswerById,
} = testsSlice.selectors

export const testsSliceReducer = testsSlice.reducer
