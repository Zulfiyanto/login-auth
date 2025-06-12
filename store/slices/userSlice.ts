import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  users: Array<{
    id: string
    email: string
    name?: string
    createdAt: string
  }>
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchUsersSuccess: (state, action: PayloadAction<UserState['users']>) => {
      state.users = action.payload
      state.loading = false
      state.error = null
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } =
  userSlice.actions
export default userSlice.reducer
