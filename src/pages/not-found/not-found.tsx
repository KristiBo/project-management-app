import React from 'react';
import './not-found.less';
import img from './../../assets/images/not-found.svg';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
export const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="not-found-wrap">
      <div className="not-found-title">
        <h2>{t('notFoundTitle')}</h2>
        <p>{t('notFoundDesc')}</p>

        <Button
          type="primary"
          className="not-found-btn"
          style={{ marginRight: 20 }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined />
          {t('back')}
        </Button>
      </div>
      <img src={img} alt="not-found" />
    </div>
  );
};
