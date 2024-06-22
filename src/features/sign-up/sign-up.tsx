import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input, message } from 'antd';

import AuthService from '../../api-services/AuthService';
import { useAppDispatch } from '../../hooks';
import { IAuth, setAuthData } from '../sign-in/signInSlice';
import { IRegistrationData } from '../../interfaces/interfaces';

import './sign-up.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export const SignUp = () => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const loginMsg = t('loginMsg');
  const passMsg = t('passMsg');
  const confirmPassMsg = t('confirmPassMsg');
  const passMatchMsg = t('passMatchMsg');
  const nameMsg = t('nameMsg');
  const nameInvalidMsg = t('nameInvalidMsg');
  const loginInvalidMsg = t('loginInvalidMsg');
  const passInvalidMsg = t('passInvalidMsg');

  const onFinish = async (values: IRegistrationData) => {
    const { userName, login, password } = values;

    setConfirmLoading(true);

    try {
      await AuthService.registration(userName, login, password);
      message.success(t('successRegisterMsg'));

      const response = await AuthService.authorization(values.login, values.password);
      localStorage.setItem('token', response.data.token);

      const { userId } = jwt_decode(response.data.token) as IAuth;
      dispatch(setAuthData(userId, login));

      navigate('/boards');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('signupError'));
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
        {...formItemLayout}
        form={form}
        name="register"
        autoComplete="off"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="userName"
          label={t('name')}
          rules={[
            { required: true, message: nameMsg, whitespace: true },
            {
              pattern: /^[a-zA-Z ]{2,}$/,
              message: nameInvalidMsg,
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="login"
          label={t('login')}
          rules={[
            { required: true, message: loginMsg, whitespace: true },
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
          name="password"
          label={t('password')}
          rules={[
            { required: true, message: passMsg },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*[0-9]).{8,12}$/,
              message: passInvalidMsg,
            },
          ]}
          hasFeedback
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label={t('confirmPassword')}
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: confirmPassMsg,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(passMatchMsg));
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          {!confirmLoading ? (
            <Button type="primary" htmlType="submit">
              {t('register')}
            </Button>
          ) : (
            <Button type="primary" loading>
              {t('registering')}
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};
