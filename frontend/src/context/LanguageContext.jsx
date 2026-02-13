import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Always default to English on first load
    const saved = localStorage.getItem('language');
    // Only use saved language if it's valid, otherwise default to 'en'
    return saved && ['en', 'am', 'om', 'so', 'ti', 'ar'].includes(saved) ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Reset Google Translate to English if language is 'en'
    if (language === 'en') {
      const googleTranslateCombo = document.querySelector('.goog-te-combo');
      if (googleTranslateCombo && googleTranslateCombo.value !== '') {
        googleTranslateCombo.value = '';
        googleTranslateCombo.dispatchEvent(new Event('change'));
      }
    }
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
