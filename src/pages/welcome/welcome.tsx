import { useTranslation } from 'react-i18next';
import { Button, Card } from 'antd';

import img from './../../assets/images/w-pic.png';
import logos from './../../assets/images/course-pic.svg';
import './welcome.less';

export const Welcome = () => {
  const { t } = useTranslation();

  const developers = [
    {
      name: t('alina'),
      description: [t('alinaDesc1'), t('alinaDesc2'), t('alinaDesc3'), t('alinaDesc4')],
    },
    {
      name: t('andrei'),
      description: [t('andreiDesc1'), t('andreiDesc2'), t('andreiDesc3'), t('andreiDesc4')],
    },
    {
      name: t('kristina'),
      description: [t('kristinaDesc1'), t('kristinaDesc2'), t('kristinaDesc3'), t('kristinaDesc4')],
    },
  ];

  const appDescriptions = [
    { title: t('localization'), description: t('localizationDesc') },
    { title: t('noLimit'), description: t('noLimitDesc') },
    { title: t('dnd'), description: t('dndDesc') },
    { title: t('search'), description: t('searchDesc') },
    { title: t('taskOwner'), description: t('taskOwnerDescr') },
  ];

  const descriptionsCads = () => {
    return appDescriptions.map((card) => {
      return (
        <Card
          className="descr-card"
          hoverable={true}
          bordered={false}
          key={card.title}
          title={card.title}
        >
          {card.description}
        </Card>
      );
    });
  };

  const developerCard = () => {
    return developers.map((developer) => {
      return (
        <Card className="dev-card" hoverable={true} key={developer.name} title={developer.name}>
          <ul>
            {developer.description.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </Card>
      );
    });
  };

  return (
    <div className="welcome-wrap">
      <section className="welcome-section">
        <div className="welcome-inner-wrap">
          <div className="greeting-wrap">
            <h1>{t('h1')}</h1>
            <p className="title-description">{t('titleDescription')}</p>
            <Button type="primary" size="large" href="#about" className="learn-more">
              {t('learnMore')}
            </Button>
          </div>
          <img src={img}></img>
        </div>
      </section>

      <section className="developers">
        <h3>{t('team')}</h3>
        <div className="developers-wrap">{developerCard()}</div>
      </section>

      <section className="rs-react-course">
        <h3>{t('courseTitle')}</h3>
        <div className="course-wrap">
          <img className="course-img" src={logos} />
          <div className="course-description">
            {t('course_description_1')}
            {t('course_description_2')}
            <strong>{t('course_description_3')}</strong>
            <br />
            <Button type="primary" size="large" className="course-btn">
              <a href="https://rs.school/reactjs/" target={'blank'}>
                {t('course_btn')}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <h3>{t('about')}</h3>
        <div className="about-wrap">{descriptionsCads()}</div>
      </section>
    </div>
  );
};
