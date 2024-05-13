import './sign-in.less';
import { Button, Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import AuthService from '../../api-services/AuthService';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useAppDispatch } from '../../hooks';
import { IAuth, setAuthData } from './signInSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IAuthorizationData } from '../../interfaces/interfaces';

export const SignIn = () => {
  const { t } = useTranslation();
  const loginMsg = t('loginMsg');
  const passMsg = t('passMsg');
  const loginInvalidMsg = t('loginInvalidMsg');
  const passInvalidMsg = t('passInvalidMsg');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (values: IAuthorizationData) => {
    setConfirmLoading(true);
    try {
      const response = await AuthService.authorization(values.login, values.password);
      localStorage.setItem('token', response.data.token);
      const { userId, login } = jwt_decode(response.data.token) as IAuth;
      dispatch(setAuthData(userId, login));
      message.success(t('successLoginMsg'));
      navigate('/boards');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('signinError'));
      } else {
        message.error(t('noNameError'));
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="user-wrap">
      {localStorage.getItem('token') && <Navigate to="/boards" replace={true} />}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={t('login')}
          name="login"
          rules={[
            { required: true, whitespace: true, message: loginMsg },
            {
              pattern: /^[A-Za-z\d]{5,}$/,
              message: loginInvalidMsg,
            },
          ]}
          hasFeedback
        >
          <Input autoComplete="username" />
        </Form.Item>

        <Form.Item
          label={t('password')}
          name="password"
          rules={[
            { required: true, whitespace: true, message: passMsg },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*[0-9]).{8,12}$/,
              message: passInvalidMsg,
            },
          ]}
          hasFeedback
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          {!confirmLoading ? (
            <Button type="primary" htmlType="submit">
              {t('submit')}
            </Button>
          ) : (
            <Button type="primary" loading>
              {t('submitting')}
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};
