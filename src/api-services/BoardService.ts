import { AxiosResponse } from 'axios';

import api from './api';
import { IBoard } from './types/types';

export default class BoardService {
  static getBoards(): Promise<AxiosResponse<IBoard[]>> {
    return api.get<IBoard[]>('/boards');
  }

  static getBoard(id: string): Promise<AxiosResponse<IBoard>> {
    return api.get<IBoard>(`/boards/${id}`);
  }

  static createBoard(title: string, description: string): Promise<AxiosResponse<IBoard>> {
    return api.post<IBoard>('/boards', { title, description });
  }

  static deleteBoard(id: string): Promise<AxiosResponse<IBoard>> {
    return api.delete(`/boards/${id}`);
  }

  static updateBoard(
    id: string,
    title: string,
    description: string
  ): Promise<AxiosResponse<IBoard>> {
    return api.put<IBoard>(`/boards/${id}`, { title, description });
  }
}
