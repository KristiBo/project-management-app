import { createAction, createSlice } from '@reduxjs/toolkit';
import { IColumn } from '../../api-services/types/types';
import { RootState } from '../../store';

const newColumnsList = createAction<IColumn[]>('newColumnsList');

const columnModalDataAction = createAction<{ boardId: string; title: string }>(
  'columnModalDataAction'
);

const currentColumn = createAction<IColumn>('currentColumn');

export const columns = createSlice({
  name: 'columns',
  initialState: {
    columnId: '',
    columnList: [] as IColumn[],
    columnModalData: {} as { boardId: string; title: string },
    currentColumn: {} as IColumn,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(newColumnsList, (state, action) => {
      state.columnList = action.payload;
    });

    builder.addCase(columnModalDataAction, (state, action) => {
      state.columnModalData = action.payload;
    });

    builder.addCase(currentColumn, (state, action) => {
      state.currentColumn = action.payload;
    });
  },
});

export const selectColumnsList = (state: RootState) => state.columns.columnList;
export const selectColumnModalData = (state: RootState) => state.columns.columnModalData;
export const selectCurrentColumn = (state: RootState) => state.columns.currentColumn;
