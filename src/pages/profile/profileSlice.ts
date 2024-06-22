import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppDispatch } from '../../store';

export interface IProfile {
  name: string;
  login: string;
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    name: '',
    login: '',
  },
  reducers: {
    setProfile(state: IProfile, action: PayloadAction<IProfile>) {
      state.name = action.payload.name;
      state.login = action.payload.login;
    },
  },
});

export const setProfile = (name: string, login: string) => async (dispatch: AppDispatch) => {
  dispatch(profileSlice.actions.setProfile({ name, login }));
};
