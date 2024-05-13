import { createAction, createSlice } from '@reduxjs/toolkit';
import { ITask } from '../../api-services/types/types';
import { RootState } from '../../store';

const taskModalDataAction = createAction<{
  boardId: string;
  columnId: string;
  title: string;
  description: string;
}>('taskModalDataAction');
const currentTask = createAction<ITask>('currentTask');
const updateTasks = createAction<boolean>('updateTasks');
export const tasks = createSlice({
  name: 'tasks',
  initialState: {
    updateTasks: false,
    taskModalData: {} as { boardId: string; columnId: string; title: string; description: string },
    currentTask: {} as ITask,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(taskModalDataAction, (state, action) => {
      state.taskModalData = action.payload;
    });
    builder.addCase(currentTask, (state, action) => {
      state.currentTask = action.payload;
    });
    builder.addCase(updateTasks, (state) => {
      state.updateTasks = !state.updateTasks;
    });
  },
});

export const selectTaskModalData = (state: RootState) => state.tasks.taskModalData;
export const selectCurrentTask = (state: RootState) => state.tasks.currentTask;
export const selectUpdateTask = (state: RootState) => state.tasks.updateTasks;
