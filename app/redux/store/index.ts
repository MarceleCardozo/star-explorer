import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import charactersReducer from '../slices/charactersSlice';

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const ReduxStore: React.FC = () => null;
export default ReduxStore;