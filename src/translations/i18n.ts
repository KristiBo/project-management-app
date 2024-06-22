import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { TRANSLATIONS_RU } from './ru';
import { TRANSLATIONS_EN } from './en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: TRANSLATIONS_EN,
      },
      ru: {
        translation: TRANSLATIONS_RU,
      },
    },
  });

const lang = localStorage.getItem('i18nextLng') || 'en';

i18n.changeLanguage(lang);
