import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ProfileResponse } from '@services/api'

type InitialState = {
  isAuth: boolean
  user: ProfileResponse | null
}
const initialState: InitialState = {
  isAuth: !!localStorage.getItem('token'),
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ProfileResponse>) => {
      state.user = action.payload
      state.isAuth = true
    },
    clearUser: (state) => {
      localStorage.removeItem('token')
      state.isAuth = false
      state.user = null
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuth: (state) => state.isAuth,
  },
})

export const { setUser, clearUser } = authSlice.actions
export const { selectUser, selectIsAuth } = authSlice.selectors

export const authReducer = authSlice.reducer
