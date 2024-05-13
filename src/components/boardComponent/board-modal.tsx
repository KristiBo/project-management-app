import { Button, Modal, Form, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import { EditOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectCurrentBoardId, selectCurrentData } from './boardSlice';
import { useTranslation } from 'react-i18next';
import './boardComponent.less';
import BoardService from '../../api-services/BoardService';
import axios from 'axios';
import { IBoard } from '../../api-services/types/types';

export const BoardModal: React.FC<{
  props: string;
  data: { title: string; description: string };
}> = (props: { props: string; data?: { title: string; description: string } }) => {
  const boardId = useAppSelector(selectCurrentBoardId);
  const data = useAppSelector(selectCurrentData);
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const titleInvalidMsg = t('titleInvalidMsg');
  const descriptionMsg = t('descriptionMsg');
  const titleMsg = t('titleMsg');
  const showModal = () => {
    dispatch({ type: 'isBoardModalAction', payload: true });
    dispatch({ type: 'currentData', payload: props });
  };
  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    dispatch({ type: 'isBoardModalAction', payload: false });
  };
  const onFinish = async (values: IBoard) => {
    setConfirmLoading(true);
    try {
      if (!!Object.values(data.data).filter((elem) => elem !== '').length) {
        const response = await BoardService.updateBoard(boardId, values.title, values.description);
        dispatch({ type: 'boardModalDataAction', payload: response.data });
        message.success(t('updateBoardMsg'));
      } else {
        const response = await BoardService.createBoard(values.title, values.description);
        dispatch({ type: 'boardModalDataAction', payload: response.data });
        message.success(t('createBoardMsg'));
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('boardError'));
      } else {
        message.error(t('noNameError'));
      }
    } finally {
      setConfirmLoading(false); // moved here
      dispatch({ type: 'isBoardModalAction', payload: false }); //moved here
    }
  };

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
  return (
    <>
      {props.props === 'header' && (
        <Button onClick={showModal} type="primary" ghost>
          {t('newBoard')} <PlusOutlined />
        </Button>
      )}
      {props.props === 'main' && (
        <Button onClick={showModal} className="new-board-btn">
          {t('newBoard')}
          <PlusOutlined />
        </Button>
      )}
      {props.props === 'board' && (
        <Button onClick={showModal} type="text">
          <EditOutlined />
        </Button>
      )}
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
            // end
          >
            {t('newBoard')}
          </div>
        }
        footer={false}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
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
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="on"
        >
          <Form.Item
            label={t('title')}
            name="title"
            rules={[
              { required: true, whitespace: true, message: titleMsg },
              { max: 20, message: titleInvalidMsg },
            ]}
          >
            <Input value={data.data.title} />
          </Form.Item>
          <Form.Item
            label={t('description')}
            name="description"
            rules={[{ required: true, whitespace: true, message: descriptionMsg }]}
          >
            <Input value={data.data.description} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button className="back" onClick={handleCancel}>
              {t('back')}
            </Button>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              {t('submit')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
