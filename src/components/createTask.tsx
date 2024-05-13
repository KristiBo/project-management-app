import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBoard } from '../api-services/types/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import TaskService from '../api-services/TaskService';
import jwt_decode from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import { selectCurrentTask } from './task/taskSlice';

export const CreateTaskForm = (props: {
  cancel: () => void;
  data: { title: string; description: string; boardId: string; columnId: string };
}) => {
  const token = localStorage.getItem('token');
  const { userId } = token ? (jwt_decode(token) as { userId: string }) : { userId: '' };
  const location = useLocation();
  const boardId = location.pathname.slice(9);
  const dispatch = useAppDispatch();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { t } = useTranslation();
  const titleMsg = t('titleMsg');
  const titleInvalidMsg = t('titleInvalidMsg');
  const descriptionMsg = t('descriptionMsg');
  const data = useAppSelector(selectCurrentTask);
  const onFinish = async (values: IBoard) => {
    setConfirmLoading(true);
    try {
      if (!!props.data.description) {
        const response = await TaskService.updateTask(
          userId,
          boardId,
          props.data.columnId,
          data.id,
          values.title,
          values.description,
          data.order
        );
        dispatch({ type: 'taskModalDataAction', payload: response.data });
        dispatch({ type: 'updateTasks' });
        message.success(t('updateTaskMsg'));
      } else {
        const response = await TaskService.createTask(
          userId,
          boardId,
          props.data.columnId,
          values.title,
          values.description
        );
        dispatch({ type: 'taskModalDataAction', payload: response.data });
        dispatch({ type: 'updateTasks' });
        message.success(t('createTaskMsg'));
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('taskError'));
      } else {
        message.error(t('noNameError'));
      }
    } finally {
      setConfirmLoading(false);
      props.cancel();
    }
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="on"
      fields={[
        { name: ['title'], value: props.data.title },
        { name: ['description'], value: props.data.description },
      ]}
    >
      <Form.Item
        label={t('title')}
        name="title"
        rules={[
          { required: true, whitespace: true, message: titleMsg },
          { max: 20, message: titleInvalidMsg },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t('description')}
        name="description"
        rules={[{ required: true, whitespace: true, message: descriptionMsg }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button className="back" onClick={props.cancel}>
          {t('back')}
        </Button>
        <Button type="primary" htmlType="submit" loading={confirmLoading}>
          {t('submit')}
        </Button>
      </Form.Item>
    </Form>
  );
};
