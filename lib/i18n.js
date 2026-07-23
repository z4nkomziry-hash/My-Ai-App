import translations from './translations.json';

export const languageMeta = {
  'EN': { name: 'English', flag: '🇺🇸', direction: 'ltr' },
  'KU-BD': { name: 'کوردستانی (بەدینی)', flag: '☀️', direction: 'rtl' },
  'KU-SO': { name: 'کوردستانی (سۆرانی)', flag: '☀️', direction: 'rtl' },
  'AR': { name: 'العربية', flag: '🇮🇶', direction: 'rtl' },
  'TR': { name: 'Türkçe', flag: '🇹🇷', direction: 'ltr' }
};

export function getDirection(lang) {
  if (lang === 'KU-BD' || lang === 'KU-SO' || lang === 'AR') {
    return 'rtl';
  }
  return 'ltr';
}

export function getTranslation(lang, key) {
  try {
    if (!key) return '';
    const keys = key.split('.');
    let current = translations[lang] || translations['EN'] || {};
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English if key missing
        let fallback = translations['EN'];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return fallback !== undefined ? fallback : key;
      }
    }
    
    return current !== undefined ? current : key;
  } catch (e) {
    return key;
  }
}
