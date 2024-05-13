import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';

export interface IAuth {
  userId: string;
  login: string;
}

export const signInSlice = createSlice({
  name: 'signIn',
  initialState: {
    userId: '',
    login: '',
  },
  reducers: {
    setAuthData(state: IAuth, action: PayloadAction<IAuth>) {
      state.login = action.payload.login;
      state.userId = action.payload.userId;
    },
  },
});
export const setAuthData = (userId: string, login: string) => async (dispatch: AppDispatch) => {
  dispatch(signInSlice.actions.setAuthData({ userId, login }));
};
export const selectUserId = (state: RootState) => state.signIn.userId;
