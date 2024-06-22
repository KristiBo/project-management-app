import { useEffect, useState } from 'react';
import { BoardComponent } from '../../components/boardComponent/boardComponent';
import { PlusOutlined } from '@ant-design/icons';
import './main.less';
import BoardService from '../../api-services/BoardService';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectBoardList, selectBoardModalData } from '../../components/boardComponent/boardSlice';
import { CreateBoardForm } from '../../components/createBoard';
import { CustomModal } from '../../features/modal/modal';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

export const Main = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const boardsList = useAppSelector(selectBoardList);
  const boardData = useAppSelector(selectBoardModalData);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await BoardService.getBoards();
      dispatch({ type: 'newBoardList', payload: response.data });
    };
    fetchData();
  }, [dispatch, boardData]);

  const renderBoards = () => {
    return boardsList.map((board) => (
      <BoardComponent
        key={board.id}
        props={{ boardId: board.id, title: board.title, description: board.description }}
      ></BoardComponent>
    ));
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
    dispatch({
      type: 'currentData',
      payload: { props: 'board', data: { title: '', description: '' } },
    });
  };

  return (
    <div className="main-wrap">
      <Button onClick={showModal} className="new-board-btn">
        {t('newBoard')}
        <PlusOutlined />
      </Button>

      <CustomModal open={open} cancel={handleCancel} footer={false} title={t('newBoard')}>
        <CreateBoardForm cancel={handleCancel} data={{ title: '', description: '' }} />
      </CustomModal>

      {renderBoards()}
    </div>
  );
};
