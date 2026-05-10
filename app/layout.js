'use client';

import { useEffect } from 'react';
import { useLangStore } from '@/lib/stores';
import './globals.css';

export default function RootLayout({ children }) {
  const { lang, loaded, loadLang } = useLangStore();

  useEffect(() => {
    loadLang();
  }, [loadLang]);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3d5c3a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <title>FDPS Field Form</title>
        <meta name="description" content="FDPS Field Data Entry PWA" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="min-h-screen bg-surface font-cairo antialiased">
        {children}
      </body>
    </html>
  );
}
