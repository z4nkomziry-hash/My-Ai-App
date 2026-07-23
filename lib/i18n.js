import translations from './translations.json';

export type LanguageCode = 'EN' | 'KU-BD' | 'KU-SO' | 'AR' | 'TR' | 'DE' | 'FR' | 'FA';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const languageMeta: Record<LanguageCode, LanguageInfo> = {
  'EN': { code: 'EN', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  'KU-BD': { code: 'KU-BD', name: 'Kurdish (Badini)', nativeName: 'کوردی (به‌دینی)', flag: '☀️', dir: 'rtl' },
  'KU-SO': { code: 'KU-SO', name: 'Kurdish (Sorani)', nativeName: 'کوردی (سۆرانی)', flag: '☀️', dir: 'rtl' },
  'AR': { code: 'AR', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  'TR': { code: 'TR', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  'DE': { code: 'DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  'FR': { code: 'FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  'FA': { code: 'FA', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
};

export function getTranslation(lang: LanguageCode, path: string): string {
  const keys = path.split('.');
  let current: any = translations[lang] || translations['EN'];

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // ئەگەر وەرگێڕانەکە بۆ ئەو زمانە دەستنەکەوت، دەگەڕێتەوە سەر ئینگلیزی
      let fallback: any = translations['EN'];
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return path;
        }
      }
      return typeof fallback === 'string' ? fallback : path;
    }
  }

  return typeof current === 'string' ? current : path;
}

export function getDirection(lang: LanguageCode): 'ltr' | 'rtl' {
  return languageMeta[lang]?.dir || 'ltr';
}
