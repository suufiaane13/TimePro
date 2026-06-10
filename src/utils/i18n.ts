import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from '@/locales/ar.json'
import it from '@/locales/it.json'

void i18n.use(initReactI18next).init({
  resources: {
    it: { translation: it },
    ar: { translation: ar },
  },
  lng: 'it',
  fallbackLng: 'it',
  interpolation: { escapeValue: false },
})

export default i18n
