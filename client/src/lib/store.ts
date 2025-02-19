import { configureStore} from "@reduxjs/toolkit";
import { chatApi } from "./api"; // RTK Query API
import userReducer from "./features/userslice";
import messageReducer from "./features/messageSlice"
export const Store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    user: userReducer,
    messages:messageReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
  
});

export type RootState= ReturnType<typeof Store.getState>;
export type AppDispatch= typeof Store.dispatch;