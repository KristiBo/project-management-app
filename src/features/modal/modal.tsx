import { Button, message, Modal } from 'antd';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';
import BoardService from '../../api-services/BoardService';
import { selectCurrentBoardId } from '../../components/boardComponent/boardSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

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
  const dispatch = useAppDispatch();
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
          await BoardService.deleteBoard(boardId);
          const response = await BoardService.getBoards();
          dispatch({ type: 'newBoardList', payload: response.data });
          message.success(t('deleteBoardMsg'));
        } catch (e) {
          if (axios.isAxiosError(e)) {
            message.error(t('boardError'));
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
