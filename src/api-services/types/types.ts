export interface IUser {
  id: string;
  name: string;
  login: string;
  password?: string;
}

export interface ITask {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId?: string;
  columnId?: string;
  files?: Array<{ filename: string; fileSize: number }>;
}

export interface IColumn {
  id: string;
  title: string;
  order: number;
  tasks?: ITask[];
}
export interface IBoard {
  id: string;
  title: string;
  description: string;
  columns?: IColumn[];
}

export interface AuthResponse {
  token: string;
}
