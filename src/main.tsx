import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'

// Get browser language
const getBrowserLanguage = () => {
  const browserLang = navigator.language.toLowerCase();
  // Check if the language starts with 'es' (es, es-ES, es-MX, etc.)
  return browserLang.startsWith('es') ? 'es' : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      }
    },
    lng: getBrowserLanguage(), // Use browser language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 