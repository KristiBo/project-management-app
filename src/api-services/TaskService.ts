import { AxiosResponse } from 'axios';
import api from './api';
import { ITask } from './types/types';

export default class TaskService {
  static getTasks(boardId: string, columnId: string): Promise<AxiosResponse<ITask[]>> {
    return api.get<ITask[]>(`/boards/${boardId}/columns/${columnId}/tasks`);
  }
  static getTask(boardId: string, columnId: string, taskId: string): Promise<AxiosResponse<ITask>> {
    return api.get<ITask>(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
  }
  static createTask(
    userId: string,
    boardId: string,
    columnId: string,
    title: string,
    description: string
  ): Promise<AxiosResponse<ITask>> {
    return api.post<ITask>(`/boards/${boardId}/columns/${columnId}/tasks`, {
      userId,
      title,
      description,
    });
  }
  static deleteTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Promise<AxiosResponse<ITask>> {
    return api.delete<ITask>(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
  }

  static updateTask(
    userId: string,
    boardId: string,
    columnId: string,
    taskId: string,
    title: string,
    description: string,
    order: number
  ): Promise<AxiosResponse<ITask>> {
    return api.put<ITask>(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`, {
      title,
      order,
      description,
      boardId,
      userId,
      columnId,
    });
  }
}
