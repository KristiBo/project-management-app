import { createAction, createSlice } from '@reduxjs/toolkit';

import { IBoard } from '../../api-services/types/types';
import { IBoardDispatch } from '../../interfaces/interfaces';
import { RootState } from '../../store';

const newBoardList = createAction<IBoard[]>('newBoardList');
const boardModalDataAction = createAction<IBoardDispatch>('boardModalDataAction');
const currentBoardId = createAction<string>('currentBoardId');
const currentData = createAction<{ props: string; data: IBoardDispatch }>('currentData');

export const boards = createSlice({
  name: 'boards',
  initialState: {
    boardsList: [] as IBoard[],
    isBoardModal: false,
    boardModalData: {} as IBoardDispatch,
    currentData: { props: '', data: {} as IBoardDispatch },
    boardId: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(newBoardList, (state, action) => {
      state.boardsList = action.payload;
    });

    builder.addCase(boardModalDataAction, (state, action) => {
      state.boardModalData = action.payload;
    });

    builder.addCase(currentData, (state, action) => {
      state.currentData = action.payload;
    });

    builder.addCase(currentBoardId, (state, action) => {
      state.boardId = action.payload;
    });
  },
});

export const selectBoardList = (state: RootState) => state.boards.boardsList;
export const selectBoardModalData = (state: RootState) => state.boards.boardModalData;
export const selectCurrentBoardId = (state: RootState) => state.boards.boardId;
export const selectCurrentData = (state: RootState) => state.boards.currentData;
