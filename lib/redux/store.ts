import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from './slices/selectionSlice';
// ...

export const store = configureStore({
  reducer: {
    selection: selectionReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch