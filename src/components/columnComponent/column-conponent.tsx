import { SetStateAction, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { t } from 'i18next';
import { Button, Card, Input, message } from 'antd';
import {
  CheckCircleTwoTone,
  PlusOutlined,
  DeleteOutlined,
  CloseCircleTwoTone,
} from '@ant-design/icons';

import { TaskComponent } from '../task/task';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { CustomModal } from '../../features/modal/modal';
import { IColumn, ITask, IUser } from '../../api-services/types/types';
import ColumnService from '../../api-services/ColumnService';
import { sortColumn } from './utils';
import { selectCurrentColumn } from './columnSlice';
import { CreateTaskForm } from '../createTask';
import TaskService from '../../api-services/TaskService';
import { selectCurrentTask, selectUpdateTask } from '../task/taskSlice';
import UserService from '../../api-services/UserService';

import './column-component.less';

export const ColumnComponent = (props: {
  props: { boardId: string; column: IColumn; columnId: string; title: string };
}) => {
  const dispatch = useAppDispatch();
  const ed = useRef(null as unknown as HTMLDivElement);
  const title = useRef(null as unknown as HTMLDivElement);
  const column = useRef(null as unknown as HTMLDivElement);
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [columnName, setColumnName] = useState(props.props.title);
  const [openConfirm, setOpenConfirm] = useState(false);
  const currentColumn = useAppSelector(selectCurrentColumn);
  const [taskList, setTaskList] = useState([] as ITask[]);
  const [userList, setUserList] = useState([] as IUser[]);
  const isUpdate = useAppSelector(selectUpdateTask);
  const currentTask = useAppSelector(selectCurrentTask);

  const boardId = location.pathname.slice(9);
  const columnId = props.props.columnId;

  useEffect(() => {
    const fetchData = async () => {
      const res = await TaskService.getTasks(boardId, columnId);
      const users = await UserService.getUsers();
      setUserList(users.data);
      setTaskList(res.data.sort(sortColumn));
    };

    fetchData();
  }, [boardId, columnId, isUpdate]);

  const renderTasks = () => {
    if (taskList) {
      return taskList.map((task) => {
        const user = userList.filter((i) => i.id === task.userId);

        return <TaskComponent key={task.id} props={task} user={user[0].login}></TaskComponent>;
      });
    } else {
      return '';
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const closeConfirm = () => {
    setOpenConfirm(false);
  };

  const openConfirmF = () => {
    dispatch({ type: 'currentColumn', payload: props.props.column });
    dispatch({ type: 'currentBoardId', payload: props.props.boardId });

    setOpenConfirm(true);
  };

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setColumnName(e.target.value);
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const editHandle = async (e: React.SyntheticEvent) => {
    e.stopPropagation();

    try {
      await ColumnService.updateColumn(
        props.props.boardId,
        props.props.column.id,
        columnName,
        props.props.column.order
      );
      const response = await ColumnService.getColumns(props.props.boardId);
      dispatch({ type: 'newColumnsList', payload: response.data.sort(sortColumn) });
      message.success(t('updateColumnMsg'));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('columnError'));
      } else {
        message.error(t('noNameError'));
      }
    } finally {
      setEdit(false);
    }
  };

  const cancelEditHandle = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setColumnName(props.props.title);
    setEdit(false);
  };

  const columnTitle = () => {
    return (
      <div className="title-wrap" onClick={handleEdit} ref={title}>
        {edit ? (
          <>
            <Input
              onChange={handleChange}
              autoFocus={true}
              type={'text'}
              value={columnName}
              className="column-title-input"
            />

            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              className="check-column-icon"
              onClick={editHandle}
              ref={ed}
            />

            <CloseCircleTwoTone
              twoToneColor="#eb2f96"
              className="cancel-column-icon"
              onClick={cancelEditHandle}
            />
          </>
        ) : (
          <p className="column-title">{props.props.title}</p>
        )}
      </div>
    );
  };

  const showModalTask = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const DragStartHandler = (e: React.MouseEvent<HTMLElement>, column: IColumn) => {
    dispatch({ type: 'currentColumn', payload: column });
  };

  const DropHandler = async (e: React.MouseEvent<HTMLElement>, column: IColumn) => {
    e.preventDefault();

    try {
      if (!!Object.keys(currentColumn).length) {
        await ColumnService.updateColumn(
          props.props.boardId,
          currentColumn.id,
          currentColumn.title,
          column.order
        );

        await ColumnService.updateColumn(
          props.props.boardId,
          column.id,
          column.title,
          currentColumn.order
        );

        const response = await ColumnService.getColumns(props.props.boardId);

        dispatch({ type: 'newColumnsList', payload: response.data.sort(sortColumn) });
      } else {
        const res = await ColumnService.getColumn(props.props.boardId, column.id);

        if (!res.data.tasks?.length) {
          await TaskService.deleteTask(currentTask.boardId!, currentTask.columnId!, currentTask.id);
          await TaskService.createTask(
            currentTask.userId,
            currentTask.boardId!,
            column.id,
            currentTask.title,
            currentTask.description
          );

          dispatch({ type: 'updateTasks' });
        }
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('columnError'));
      } else {
        message.error(t('noNameError'));
      }
    } finally {
      dispatch({ type: 'currentColumn', payload: {} });
    }
  };

  return (
    <Card
      ref={column}
      className="column"
      title={columnTitle()}
      bordered={false}
      extra={[
        <DeleteOutlined key="ed" onClick={openConfirmF} />,
        <CustomModal
          key={'del-confirm'}
          open={openConfirm}
          cancel={closeConfirm}
          footer={true}
          title={t('deleteColumn')}
        >
          <p>{t('deleteColumnQuestion')}</p>
        </CustomModal>,
      ]}
      style={{ maxHeight: '64vh' }}
      hoverable={true}
      draggable={true}
      onDragStart={(e: React.MouseEvent<HTMLElement>) => DragStartHandler(e, props.props.column)}
      onDragOver={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
      }}
      onDrop={(e: React.MouseEvent<HTMLElement>) => DropHandler(e, props.props.column)}
      actions={[
        <>
          <Button key={'new-task'} type="primary" ghost onClick={showModalTask}>
            {t('newTask')} <PlusOutlined />
          </Button>

          <CustomModal
            key={'new-modal'}
            open={openModal}
            cancel={handleCancel}
            footer={false}
            title={t('newTask')}
          >
            <CreateTaskForm
              cancel={handleCancel}
              data={{ title: '', description: '', boardId, columnId }}
            />
          </CustomModal>
        </>,
      ]}
    >
      <div className="tasks-wrap">{renderTasks()}</div>
    </Card>
  );
};
