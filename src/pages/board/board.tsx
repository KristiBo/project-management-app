import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import { ColumnComponent } from '../../components/columnComponent/column-conponent';
import {
  selectColumnModalData,
  selectColumnsList,
} from '../../components/columnComponent/columnSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { CustomModal } from '../../features/modal/modal';
import { CreateColumnForm } from '../../components/createColumn';
import ColumnService from '../../api-services/ColumnService';
import { sortColumn } from '../../components/columnComponent/utils';
import { selectTaskModalData } from '../../components/task/taskSlice';

import './board.less';

export const Board = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const id = location.pathname.slice(9);
  const columnsList = useAppSelector(selectColumnsList);
  const columnData = useAppSelector(selectColumnModalData);
  const taskData = useAppSelector(selectTaskModalData);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await ColumnService.getColumns(id);
      dispatch({ type: 'newColumnsList', payload: response.data.sort(sortColumn) });
    };
    fetchData();
  }, [dispatch, columnData, taskData, id]);

  const renderColumns = () => {
    return columnsList.map((column) => (
      <ColumnComponent
        key={column.id}
        props={{ boardId: id, column, columnId: column.id, title: column.title }}
      ></ColumnComponent>
    ));
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
    dispatch({
      type: 'columnData',
      payload: { props: 'column', data: { title: '' } },
    });
  };

  return (
    <div className="columns-wrap">
      <div className="btn-column-wrap">
        <NavLink to="/boards">
          <Button type="primary" style={{ marginRight: 20 }}>
            <ArrowLeftOutlined />
            {t('back')}
          </Button>
        </NavLink>

        <Button onClick={showModal} className="new-column-btn">
          {t('newColumn')}
          <PlusOutlined />
        </Button>
      </div>

      <div className="inner-wrap">
        <CustomModal open={open} cancel={handleCancel} footer={false} title={t('newColumn')}>
          <CreateColumnForm cancel={handleCancel} data={{ title: '' }} />
        </CustomModal>
        <div className="columns-inner-wrap">{renderColumns()}</div>
      </div>
    </div>
  );
};
