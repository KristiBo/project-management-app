import { Navigate } from 'react-router-dom';

export const Start = () => {
  if (localStorage.getItem('token')) {
    return <Navigate to="/boards" replace={true} />;
  }

  return <Navigate to="/welcome" replace={true} />;
};
