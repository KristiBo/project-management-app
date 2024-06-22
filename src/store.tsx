import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';

import { boards } from './components/boardComponent/boardSlice';
import { columns } from './components/columnComponent/columnSlice';
import { tasks } from './components/task/taskSlice';
import { signInSlice } from './features/sign-in/signInSlice';

const rootReducer = combineReducers({
  columns: columns.reducer,
  signIn: signInSlice.reducer,
  boards: boards.reducer,
  tasks: tasks.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
