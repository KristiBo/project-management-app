import { Layout } from 'antd';
import { HeaderLayout } from './features/header/header';
import { FooterLayout } from './features/footer/footer';
import { SignIn } from './features/sign-in/sign-in';
import { SignUp } from './features/sign-up/sign-up';
import './translations/i18n';
import './App.less';
import { Main } from './pages/main/main';
import { Board } from './pages/board/board';
import { NotFound } from './pages/not-found/not-found';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Welcome } from './pages/welcome/welcome';
import { PrivateRoute } from './PrivateRoute';
import { Profile } from './pages/profile/profile';
import { Start } from './pages/start/start';
import { useEffect, useState } from 'react';
import jwtDecode, { JwtPayload } from 'jwt-decode';
const { Content } = Layout;
function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const tokenCheck = () => {
      const token = localStorage.getItem('token') as string;
      if (token) {
        const dateNow = new Date().getTime();
        const decoded = jwtDecode<JwtPayload>(token);
        const iat = (jwtDecode<JwtPayload>(token)?.iat as number) * 1000;
        const timeout = 1000 * 60 * 60 * 1;
        const expTime = decoded.exp ? dateNow - decoded.exp * 1000 : timeout - (dateNow - iat);
        const timer = setTimeout(() => {
          localStorage.removeItem('token');
          navigate('/welcome');
        }, expTime);
        return () => clearTimeout(timer);
      }
    };
    tokenCheck();
  });
  const location = useLocation();
  const address = location.pathname.slice(9);
  const boards = location.pathname.slice(0, 7);
  const style =
    address === '' ? { padding: '0', marginTop: 64 } : { padding: '0 20px', marginTop: 64 };
  const bgStyle =
    address === '' ? { padding: '0', height: '100%' } : { padding: '24px 0', height: '100%' };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {(location.pathname === '/' ||
        location.pathname === '/signin' ||
        location.pathname === '/signup' ||
        location.pathname === '/profile' ||
        location.pathname === '/welcome' ||
        boards === '/boards') && <HeaderLayout />}

      <Content className="site-layout" style={style}>
        <div className="site-layout-background" style={bgStyle}>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<PrivateRoute page={<Profile />} />} />
            <Route path="/boards" element={<PrivateRoute page={<Main />} />} />
            <Route path="/boards/:id" element={<PrivateRoute page={<Board />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Content>
      {(location.pathname === '/' ||
        location.pathname === '/signin' ||
        location.pathname === '/signup' ||
        location.pathname === '/profile' ||
        location.pathname === '/welcome' ||
        boards === '/boards') && <FooterLayout />}
    </Layout>
  );
}

export default App;
