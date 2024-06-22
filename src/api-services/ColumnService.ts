import { AxiosResponse } from 'axios';

import api from './api';
import { IColumn } from './types/types';

export default class ColumnService {
  static getColumns(boardId: string): Promise<AxiosResponse<IColumn[]>> {
    return api.get<IColumn[]>(`/boards/${boardId}/columns`);
  }

  static getColumn(boardId: string, columnId: string): Promise<AxiosResponse<IColumn>> {
    return api.get<IColumn>(`/boards/${boardId}/columns/${columnId}`);
  }

  static createColumn(boardId: string, title: string): Promise<AxiosResponse<IColumn>> {
    return api.post<IColumn>(`/boards/${boardId}/columns`, { title });
  }

  static deleteColumn(boardId: string, columnId: string): Promise<AxiosResponse<IColumn>> {
    return api.delete<IColumn>(`/boards/${boardId}/columns/${columnId}`);
  }

  static updateColumn(
    boardId: string,
    columnId: string,
    title: string,
    order: number
  ): Promise<AxiosResponse<IColumn>> {
    return api.put<IColumn>(`/boards/${boardId}/columns/${columnId}`, {
      title,
      order,
    });
  }
}
