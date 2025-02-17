import { configureStore} from "@reduxjs/toolkit";
import { chatApi } from "./api"; // RTK Query API
import userReducer from "./features/userslice";

export const Store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
   // ✅ Add RTK Query middleware
});

export type RootState= ReturnType<typeof Store.getState>;
export type AppDispatch= typeof Store.dispatch;