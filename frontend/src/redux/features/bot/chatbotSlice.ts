import { createSlice } from "@reduxjs/toolkit";

interface ChatbotState {
  isOpen: boolean;
}

const initialState: ChatbotState = {
  isOpen: false,
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    openChatbot: (state) => {
      state.isOpen = true;
    },
    closeChatbot: (state) => {
      state.isOpen = false;
    },
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openChatbot, closeChatbot, toggleChatbot } =
  chatbotSlice.actions;

export default chatbotSlice.reducer;