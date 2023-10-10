import { configureStore } from '@reduxjs/toolkit'
import messageSlice from './Message/messageSlice'

export const MyStore = configureStore({
  reducer: {
    messager: messageSlice,
  },
})

