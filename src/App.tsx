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
import { Route, Routes, useLocation } from 'react-router-dom';
import { Welcome } from './pages/welcome/welcome';
import { Protected } from './Protected';
import { Profile } from './pages/profile/profile';
const { Content } = Layout;
function App() {
  const location = useLocation();
  const address = location.pathname.slice(9);
  const style =
    address === '' ? { padding: '0 ', marginTop: 64 } : { padding: '0 20px', marginTop: 64 };
  const bgStyle =
    address === '' ? { padding: '0', minHeight: '80vh' } : { padding: '24px', minHeight: '80vh' };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderLayout />
      <Content className="site-layout" style={style}>
        <div className="site-layout-background" style={bgStyle}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/boards" element={<Protected page={<Main />} />} />
            <Route path="/boards/:id" element={<Protected page={<Board />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Content>
      <FooterLayout />
    </Layout>
  );
}

export default App;
