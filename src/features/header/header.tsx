import { Avatar, Button, Divider, Switch } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { useEffect, useState } from 'react';
import i18n from 'i18next';
import './header.less';
import { DownOutlined, PlusOutlined, UserAddOutlined, ExportOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { PandaIcon } from '../../components/logo';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import UserService from '../../api-services/UserService';
import jwt_decode from 'jwt-decode';
import { CreateBoardForm } from '../../components/createBoard';
import { CustomModal } from '../modal/modal';
import { NavLink, useNavigate } from 'react-router-dom';

export const HeaderLayout = () => {
  const { t } = useTranslation();
  const userId = useAppSelector((state) => state.signIn.userId);
  const dispatch = useAppDispatch();
  const [matches, setMatches] = useState(window.matchMedia('(max-width: 550px)').matches);
  const [userName, setUserName] = useState('');
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const scrolled = scroll ? 'header scrolled' : 'header';
  const height = scroll ? '64px' : '70px';
  const navigate = useNavigate();
  const checked = localStorage.getItem('i18nextLng') === 'en';
  const handleCancel = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
    dispatch({
      type: 'currentData',
      payload: { props: 'board', data: { title: '', description: '' } },
    });
  };

  const onChange = (checked: boolean) => {
    if (checked) {
      i18n.changeLanguage('en');
      localStorage.setItem('i18nextLng', 'en');
    } else {
      i18n.changeLanguage('ru');
      localStorage.setItem('i18nextLng', 'ru');
    }
  };

  const onExit = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const items: MenuProps['items'] = [
    {
      label: <p onClick={() => navigate('/profile')}>{t('profile')}</p>,
      key: '0',
    },
    {
      label: <a href="#">{t('tasks')}</a>,
      key: '1',
    },
    {
      label: <p onClick={onExit}>{t('signOut')}</p>,
      key: '2',
    },
  ];

  useEffect(() => {
    const onScroll = () => {
      window.pageYOffset === 0 ? setScroll(false) : setScroll(true);
    };
    window.addEventListener('scroll', onScroll);
    window
      .matchMedia('(min-width: 550px)')
      .addEventListener('change', (e) => setMatches(e.matches));
    const token = localStorage.getItem('token');
    if (token) {
      const fetchData = async () => {
        const { userId } = jwt_decode(token) as { userId: string };
        const response = await UserService.getUser(userId);
        setUserName(response.data.name);
      };
      fetchData();
    }
  }, [userId]);

  const isAuth = localStorage.getItem('token');

  return (
    <>
      <Header className={scrolled} style={{ height: height }}>
        <div className="logo-wrap">
          <NavLink to="/welcome" className="logo">
            <PandaIcon style={{ fontSize: '48px' }} />
          </NavLink>

          {isAuth && !matches && (
            <div className="boards-block">
              <NavLink to="/boards">
                <Button type="primary" style={{ color: 'white', marginRight: 20 }}>
                  {t('mainPage')}
                </Button>
              </NavLink>
              <Button onClick={showModal} type="primary" ghost>
                {t('newBoard')} <PlusOutlined />
              </Button>
              <CustomModal open={open} cancel={handleCancel} footer={false} title={'New Board'}>
                <CreateBoardForm cancel={handleCancel} data={{ title: '', description: '' }} />
              </CustomModal>
            </div>
          )}
        </div>

        <div className="auth-wrap">
          {!isAuth && (
            <div>
              <NavLink to="/signup">
                <Button type="text" style={{ color: 'white' }}>
                  {!matches ? <UserAddOutlined /> : t('signUp')}
                </Button>
              </NavLink>
              <Divider type="vertical" style={{ background: 'white' }} />
              <NavLink to="/signin">
                <Button type="text" style={{ color: 'white' }}>
                  {!matches ? <span className="signin-span" /> : t('signIn')}
                </Button>
              </NavLink>
            </div>
          )}

          <Switch
            checkedChildren="EN"
            unCheckedChildren="Ру"
            defaultChecked={checked}
            onChange={onChange}
          />
          {isAuth && (
            <Dropdown menu={{ items }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size={48}>{userName}</Avatar>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          )}
        </div>
      </Header>
    </>
  );
};
