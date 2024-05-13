import { Button, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../hooks';
import { CustomModal } from '../../features/modal/modal';
import { CreateBoardForm } from '../createBoard';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './boardComponent.less';
export const BoardComponent = (props: {
  props: { boardId: string; title: string; description: string };
}) => {
  const del = useRef(null as unknown as HTMLDivElement);
  const ed = useRef(null as unknown as HTMLDivElement);
  const board = useRef(null as unknown as HTMLDivElement);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleClick = (e: React.SyntheticEvent) => {
    dispatch({ type: 'currentBoardId', payload: props.props.boardId });
    if (
      board.current?.contains(e.target as Node) &&
      !del.current?.contains(e.target as Node) &&
      !ed.current?.contains(e.target as Node)
    )
      navigate(`/boards/:${props.props.boardId}`);
  };
  const { t } = useTranslation();
  const handleCancel = () => {
    setOpen(false);
  };
  const closeConfirm = () => {
    setOpenConfirm(false);
  };

  const showModal = () => {
    setOpen(true);
    dispatch({
      type: 'currentData',
      payload: {
        props: 'board',
        data: { title: props.props.title, description: props.props.description },
      },
    });
  };

  const showConfirm = () => {
    setOpenConfirm(true);
  };

  return (
    <Card
      ref={board}
      onClick={handleClick}
      title={props.props.title || ''}
      bordered={false}
      extra={[
        <Button key={'1'} onClick={showModal} type="text" ref={ed}>
          <EditOutlined />
        </Button>,
        <CustomModal
          key={'2'}
          open={open}
          cancel={handleCancel}
          footer={false}
          title={t('editBoard')}
        >
          <CreateBoardForm
            cancel={handleCancel}
            data={{ title: props.props.title, description: props.props.description }}
          />
        </CustomModal>,
        <Button key={'3'} onClick={showConfirm} type="text" ref={del}>
          <DeleteOutlined />
        </Button>,
        <CustomModal
          key={'4'}
          open={openConfirm}
          cancel={closeConfirm}
          footer={true}
          title={t('deleteBoard')}
        >
          <p>{t('deleteBoardQuestion')}</p>
        </CustomModal>,
      ]}
      // style={{ width: 250, maxHeight: '70vh', overflow: 'hidden' }}
    >
      {props.props.description || ''}
    </Card>
  );
};
