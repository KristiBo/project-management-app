import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Divider, Switch, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { DownOutlined, PlusOutlined, UserAddOutlined, MenuOutlined } from '@ant-design/icons';

import { PandaIcon } from '../../components/logo';
import { useAppDispatch, useAppSelector } from '../../hooks';
import UserService from '../../api-services/UserService';
import { CreateBoardForm } from '../../components/createBoard';
import { CustomModal } from '../modal/modal';

import './header.less';

export const HeaderLayout = () => {
  const { t } = useTranslation();
  const userId = useAppSelector((state) => state.signIn.userId);
  const dispatch = useAppDispatch();
  const [matches, setMatches] = useState(window.matchMedia('(max-width: 550px)').matches);
  const [userName, setUserName] = useState('');
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();

  const scrolled = scroll ? 'header scrolled' : 'header';
  const height = scroll ? '64px' : '70px';
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

  const items: MenuProps['items'] = !matches
    ? [
        {
          label: <p onClick={() => navigate('/profile')}>{t('profile')}</p>,
          key: '0',
        },
        {
          label: <p onClick={onExit}>{t('signOut')}</p>,
          key: '1',
        },
      ]
    : [
        {
          label: <p onClick={() => navigate('/boards')}>{t('mainPage')}</p>,
          key: '0',
        },
        {
          label: <p onClick={() => showModal()}>{t('newBoard')}</p>,
          key: '1',
        },
        {
          label: <p onClick={() => navigate('/profile')}>{t('profile')}</p>,
          key: '2',
        },
        {
          label: <p onClick={onExit}>{t('signOut')}</p>,
          key: '3',
        },
      ];

  useEffect(() => {
    const onScroll = () => {
      window.scrollY === 0 ? setScroll(false) : setScroll(true);
    };

    window.addEventListener('scroll', onScroll);

    window
      .matchMedia('(max-width: 550px)')
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
                {t('newBoard')}
                <PlusOutlined />
              </Button>
            </div>
          )}
        </div>

        <div className="auth-wrap">
          {!isAuth && (
            <div>
              <NavLink to="/signup">
                <Button type="text" style={{ color: 'white' }}>
                  {matches ? <UserAddOutlined /> : t('signUp')}
                </Button>
              </NavLink>
              <Divider type="vertical" style={{ background: 'white' }} />
              <NavLink to="/signin">
                <Button type="text" style={{ color: 'white' }}>
                  {matches ? <span className="signin-span" /> : t('signIn')}
                </Button>
              </NavLink>{' '}
            </div>
          )}

          <CustomModal open={open} cancel={handleCancel} footer={false} title={t('newBoard')}>
            <CreateBoardForm cancel={handleCancel} data={{ title: '', description: '' }} />
          </CustomModal>

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
                  {matches ? (
                    <MenuOutlined style={{ fontSize: 48, marginTop: 16 }} />
                  ) : (
                    <>
                      <Avatar size={48}>{userName}</Avatar>
                      <DownOutlined />
                    </>
                  )}
                </Space>
              </a>
            </Dropdown>
          )}
        </div>
      </Header>
    </>
  );
};
