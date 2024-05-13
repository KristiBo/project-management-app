import { Avatar, Card, message } from 'antd';
import { useState } from 'react';
import { ITask } from '../../api-services/types/types';
import { CustomModal } from '../../features/modal/modal';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { DeleteFilled, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CreateTaskForm } from '../createTask';
import jwt_decode from 'jwt-decode';
import { selectCurrentTask } from './taskSlice';
import TaskService from '../../api-services/TaskService';
import axios from 'axios';
export const TaskComponent = (props: { props: ITask; user: string }) => {
  const token = localStorage.getItem('token');
  const { login } = token ? (jwt_decode(token) as { login: string }) : { login: '' };
  const description = props.props.description;
  const { t } = useTranslation();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const currentTask = useAppSelector(selectCurrentTask);
  const openConfirmF = () => {
    dispatch({ type: 'currentTask', payload: props.props });
    setOpenConfirm(true);
  };
  const closeConfirm = () => {
    setOpenConfirm(false);
  };
  const showModal = () => {
    setOpen(true);
    dispatch({
      type: 'currentTask',
      payload: props.props,
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const DragStartHandler = (e: React.MouseEvent<HTMLElement>, task: ITask) => {
    e.stopPropagation();
    dispatch({ type: 'currentTask', payload: task });
  };

  const DropHandler = async (e: React.MouseEvent<HTMLElement>, task: ITask) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (currentTask.columnId === task.columnId) {
        await Promise.all([
          TaskService.updateTask(
            currentTask.userId,
            currentTask.boardId!,
            currentTask.columnId!,
            currentTask.id,
            currentTask.title,
            currentTask.description,
            task.order
          ),
          TaskService.updateTask(
            task.userId,
            task.boardId!,
            task.columnId!,
            task.id,
            task.title,
            task.description,
            currentTask.order
          ),
        ]);
      } else {
        await Promise.all([
          TaskService.deleteTask(task.boardId!, task.columnId!, task.id),
          TaskService.deleteTask(currentTask.boardId!, currentTask.columnId!, currentTask.id),
        ]);

        const newCurrentTask = await TaskService.createTask(
          currentTask.userId,
          currentTask.boardId!,
          task.columnId!,
          currentTask.title,
          currentTask.description
        );

        await TaskService.updateTask(
          newCurrentTask.data.userId,
          newCurrentTask.data.boardId!,
          newCurrentTask.data.columnId!,
          newCurrentTask.data.id,
          newCurrentTask.data.title,
          newCurrentTask.data.description,
          task.order
        );

        const newTask = await TaskService.createTask(
          task.userId,
          task.boardId!,
          currentTask.columnId!,
          task.title,
          task.description
        );
        await TaskService.updateTask(
          newTask.data.userId,
          newTask.data.boardId!,
          newTask.data.columnId!,
          newTask.data.id,
          newTask.data.title,
          newTask.data.description,
          currentTask.order
        );
      }

      dispatch({ type: 'updateTasks' });
      message.success(t('updateTaskMsg'));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('taskError'));
      } else {
        message.error(t('noNameError'));
      }
    }
  };

  return (
    <Card
      draggable={true}
      onDragStart={(e: React.MouseEvent<HTMLElement>) => DragStartHandler(e, props.props)}
      onDragOver={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
      }}
      onDrop={(e: React.MouseEvent<HTMLElement>) => DropHandler(e, props.props)}
      size="small"
      title={props.props.title}
      extra={[
        <EditOutlined key="ed" onClick={showModal} style={{ fontSize: '10px', marginRight: 10 }} />,
        <CustomModal
          key={'ed-confirm'}
          open={open}
          cancel={handleCancel}
          footer={false}
          title={t('editTask')}
        >
          <CreateTaskForm
            cancel={handleCancel}
            data={{
              title: props.props.title,
              description: props.props.description,
              boardId: props.props.boardId as string,
              columnId: props.props.columnId as string,
            }}
          />
        </CustomModal>,
        <DeleteFilled key="del" onClick={openConfirmF} style={{ fontSize: '10px' }} />,
        <CustomModal
          key={'del-confirm'}
          open={openConfirm}
          cancel={closeConfirm}
          footer={true}
          title={t('deleteTask')}
        >
          <p>{t('deleteTaskQuestion')}</p>
        </CustomModal>,
      ]}
      actions={[
        <Avatar key={login} size={32} style={{ left: '35%' }}>
          {props.user}
        </Avatar>,
      ]}
      style={{ width: 230, marginBottom: 10 }}
    >
      <p className="task">{description}</p>
    </Card>
  );
};
