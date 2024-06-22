import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { Button, message, Modal } from 'antd';

import BoardService from '../../api-services/BoardService';
import ColumnService from '../../api-services/ColumnService';
import UserService from '../../api-services/UserService';
import TaskService from '../../api-services/TaskService';
import { selectCurrentBoardId } from '../../components/boardComponent/boardSlice';
import { selectCurrentColumn } from '../../components/columnComponent/columnSlice';
import { selectCurrentTask } from '../../components/task/taskSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { IAuth } from '../sign-in/signInSlice';

import './modal.less';

export const CustomModal: React.FC<{
  open: boolean;
  cancel: () => void;
  children: JSX.Element;
  footer: boolean;
  title: string;
}> = (props: {
  open: boolean;
  cancel: () => void;
  children: JSX.Element;
  footer: boolean;
  title: string;
}) => {
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const draggleRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const boardId = useAppSelector(selectCurrentBoardId);
  const column = useAppSelector(selectCurrentColumn);
  const task = useAppSelector(selectCurrentTask);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();

    if (!targetRect) {
      return;
    }

    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const deleteItem = async () => {
    switch (props.title) {
      case t('deleteBoard'):
        try {
          setConfirmLoading(true);
          await BoardService.deleteBoard(boardId);
          const response = await BoardService.getBoards();
          dispatch({ type: 'newBoardList', payload: response.data });
          message.success(t('deleteBoardMsg'));
          setConfirmLoading(false);
        } catch (e) {
          if (axios.isAxiosError(e)) {
            message.error(t('boardError'));
          } else {
            message.error(t('noNameError'));
          }
        }
        break;

      case t('deleteColumn'):
        try {
          setConfirmLoading(true);
          await ColumnService.deleteColumn(boardId, column.id);
          const response = await ColumnService.getColumns(boardId);
          dispatch({ type: 'newColumnsList', payload: response.data });
          message.success(t('deleteColumnMsg'));
          setConfirmLoading(false);
        } catch (e) {
          if (axios.isAxiosError(e)) {
            message.error(t('columnError'));
          } else {
            message.error(t('noNameError'));
          }
        }
        break;

      case t('deleteUser'):
        try {
          setConfirmLoading(true);
          const token = localStorage.getItem('token') as string;
          const { userId } = jwt_decode(token) as IAuth;
          await UserService.deleteUser(userId);
          localStorage.removeItem('token');
          message.success(t('deleteUserMsg'));
          setConfirmLoading(false);
          navigate('/');
        } catch (e) {
          if (axios.isAxiosError(e)) {
            message.error(t('signinError'));
          } else {
            message.error(t('noNameError'));
          }
        } finally {
          dispatch({ type: 'currentColumn', payload: {} });
        }
        break;

      case t('deleteTask'):
        try {
          setConfirmLoading(true);
          await TaskService.deleteTask(task.boardId as string, task.columnId as string, task.id);
          dispatch({ type: 'updateTasks' });
          setConfirmLoading(false);
          message.success(t('deleteTaskMsg'));
        } catch (e) {
          if (axios.isAxiosError(e)) {
            message.error(t('taskError'));
          } else {
            message.error(t('noNameError'));
          }
        }
        break;

      default:
        break;
    }

    props.cancel();
  };

  return (
    <Modal
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          {props.title}
        </div>
      }
      open={props.open}
      footer={
        props.footer
          ? [
              <Button key="back" onClick={props.cancel}>
                {t('cancel')}
              </Button>,
              <Button key="yes" type="primary" onClick={deleteItem} loading={confirmLoading}>
                {t('yes')}
              </Button>,
            ]
          : false
      }
      onCancel={props.cancel}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event: DraggableEvent, uiData: DraggableData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      {props.children}
    </Modal>
  );
};
