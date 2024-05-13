import { Footer } from 'antd/lib/layout/layout';
import { useTranslation } from 'react-i18next';
import image from './../../assets/images/rs_school_js.svg';
import './footer.less';
export const FooterLayout = () => {
  const { t } = useTranslation();
  return (
    <>
      <Footer style={{ textAlign: 'center', padding: 0 }}>
        <div className="footer-inner-wrap">
          <ul className="team-contacts">
            <li>
              <a href="https://github.com/KristiBo" target={'blank'}>
                {t('kristina')}
              </a>
            </li>
            <li>
              <a href="https://github.com/Nevold" target={'blank'}>
                {t('andrei')}
              </a>
            </li>

            <li>
              <a href="https://github.com/spadarynjaALINA" target={'blank'}>
                {t('alina')}
              </a>
            </li>
          </ul>

          <p className="footer-date">©copyright 2022</p>

          <a href="https://rs.school" className="footer-image">
            <img src={image} />
          </a>
        </div>
      </Footer>
    </>
  );
};
