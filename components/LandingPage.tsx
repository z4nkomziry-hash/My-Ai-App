'use client';

import React, { useState } from 'react';
import { getTranslation, getDirection, languageMeta, LanguageCode } from '@/lib/i18n';[span_1](start_span)[span_1](end_span)

export default function LandingPage() {
  // دیاریکردنی زمانی سەرەتایی (بۆ نموونە بادینی)
  const [lang, setLang] = useState<LanguageCode>('KU-BD');

  // وەرگرتنی ئاڕاستەی دەق (RTL بۆ کوردی/عەرەبی، LTR بۆ ئینگلیزی)
  const dir = getDirection(lang);

  return (
    <div dir={dir} className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 bg-slate-800 border-b border-slate-700">
        <div className="text-xl font-bold text-blue-400">
          Logo
        </div>

        {/* بەشی بەستەرەکان (Navigation Links) */}
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-400">{getTranslation(lang, 'nav.home')}</a>
          <a href="#" className="hover:text-blue-400">{getTranslation(lang, 'nav.features')}</a>
          <a href="#" className="hover:text-blue-400">{getTranslation(lang, 'nav.pricing')}</a>
          <a href="#" className="hover:text-blue-400">{getTranslation(lang, 'nav.contact')}</a>
        </div>

        {/* بەشی هەڵبژاردنی زمان و چوونەژوورەوە */}
        <div className="flex items-center gap-4">
          {/* Select بۆ گۆڕینی زمان */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as LanguageCode)}
            className="bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none"
          >
            {Object.values(languageMeta).map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.nativeName}
              </option>
            ))}
          </select>

          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition">
            {getTranslation(lang, 'nav.signIn')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center mt-20 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          {getTranslation(lang, 'nav.home')}
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          کۆدی سەرکەوتووانە بەستراوەتەوە بە فایلی i18n و وەرگێڕانەکان کاردەکەن!
        </p>
        <button className="bg-green-600 hover:bg-green-500 text-white text-lg px-8 py-3 rounded-xl font-bold transition">
          {getTranslation(lang, 'nav.tryFree')}
        </button>
      </main>
    </div>
  );
}
