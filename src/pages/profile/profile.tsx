import { useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks';
import { IAuth, setAuthData } from '../../features/sign-in/signInSlice';
import jwt_decode from 'jwt-decode';
import '../../features/sign-up/sign-up.less';
import { useState } from 'react';
import { IRegistrationData } from '../../interfaces/interfaces';
import { CustomModal } from '../../features/modal/modal';
import UserService from '../../api-services/UserService';
import { setProfile } from './profileSlice';

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

export const Profile = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const loginMsg = t('loginMsg');
  const passMsg = t('passMsg');
  const confirmPassMsg = t('confirmPassMsg');
  const passMatchMsg = t('passMatchMsg');
  const nameMsg = t('nameMsg');
  const nameInvalidMsg = t('nameInvalidMsg');
  const loginInvalidMsg = t('loginInvalidMsg');
  const passInvalidMsg = t('passInvalidMsg');
  const dispatch = useAppDispatch();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const token = localStorage.getItem('token') as string;
  const { userId } = jwt_decode(token) as IAuth;

  const getUserData = async () => {
    try {
      const response = await UserService.getUser(userId);
      dispatch(setProfile(response.data.name, response.data.login));
      form.setFieldsValue({ userName: response.data.name, login: response.data.login });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('signinError'));
      } else {
        message.error(t('noNameError'));
      }
    }
  };

  useEffect(() => {
    getUserData();
  });

  const onFinish = async (values: IRegistrationData) => {
    const { userName, login, password } = values;
    setConfirmLoading(true);
    try {
      await UserService.updateUser(userId, userName, login, password);
      message.success(t('updateUserMsg'));
      dispatch(setAuthData(userId, login));
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

  const showConfirm = () => {
    setOpenConfirm(true);
  };

  const closeConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <div className="user-wrap">
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
        <Form.Item
          {...tailFormItemLayout}
          extra={[
            <Button
              key={'edit'}
              type="primary"
              htmlType="submit"
              loading={confirmLoading}
              style={{ marginRight: 20 }}
            >
              {t('edit')}
            </Button>,
            <Button key={'del'} type="primary" onClick={showConfirm}>
              {t('delete')}
            </Button>,
            <CustomModal
              key={'del-confirm'}
              open={openConfirm}
              cancel={closeConfirm}
              footer={true}
              title={t('deleteUser')}
            >
              <p>{t('deleteUserQuestion')}</p>
            </CustomModal>,
          ]}
        ></Form.Item>
      </Form>
    </div>
  );
};
