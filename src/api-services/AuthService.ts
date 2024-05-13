import { AxiosResponse } from 'axios';
import api from './api';
import { AuthResponse, IUser } from './types/types';

export default class AuthService {
  static async authorization(
    login: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>('/signin', { login, password });
  }

  static async registration(
    name: string,
    login: string,
    password: string
  ): Promise<AxiosResponse<IUser>> {
    return api.post<IUser>('/signup', { name, login, password });
  }
}
