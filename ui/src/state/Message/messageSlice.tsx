import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type MessageAction = {
    content: any
}
export const messageSlice = createSlice({
    name: 'messager',
    initialState: 0,
    reducers: {
        messageCounter: (state) => {
            state = + 1
        }
    },
})

export const {
    messageCounter
} = messageSlice.actions

export default messageSlice.reducer