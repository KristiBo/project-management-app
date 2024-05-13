export interface IBoardDispatch {
  title: string;
  description: string;
}

export interface IRegistrationData {
  userName: string;
  login: string;
  password: string;
  confirm?: string;
}

export interface IAuthorizationData {
  login: string;
  password: string;
}
