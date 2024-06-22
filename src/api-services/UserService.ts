import { AxiosResponse } from 'axios';

import api from './api';
import { IUser } from './types/types';

export default class UserService {
  static getUsers(): Promise<AxiosResponse<IUser[]>> {
    return api.get<IUser[]>('/users');
  }

  static getUser(id: string): Promise<AxiosResponse<IUser>> {
    return api.get<IUser>(`/users/${id}`);
  }

  static deleteUser(id: string): Promise<AxiosResponse<IUser>> {
    return api.delete(`/users/${id}`);
  }

  static updateUser(
    id: string,
    name: string,
    login: string,
    password: string
  ): Promise<AxiosResponse<IUser>> {
    return api.put<IUser>(`/users/${id}`, { name, login, password });
  }
}
