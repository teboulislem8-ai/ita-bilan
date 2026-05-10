import './globals.css';

export const metadata = {
  title: 'FDPS Field Form',
  description: 'FDPS Field Data Entry PWA',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3d5c3a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-surface font-cairo antialiased">
        {children}
      </body>
    </html>
  );
}
