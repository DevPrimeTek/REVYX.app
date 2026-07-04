import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'REVYX — Sistemul de execuție al agentului imobiliar',
  description:
    'REVYX este instrumentul de lucru zilnic al agentului imobiliar din Republica Moldova: nu pierzi lead-uri, potriviri client ↔ proprietate, flux clar de tranzacții. Vânzare și chirie. Încearcă demo-ul și participă la dezvoltare — un an gratuit.',
  applicationName: 'REVYX',
  authors: [{ name: 'ITPRO SYSTEM SRL' }],
  keywords: [
    'agent imobiliar',
    'imobiliare Moldova',
    'CRM imobiliar',
    'REVYX',
    'gestiune lead-uri',
    'недвижимость Молдова',
  ],
  openGraph: {
    title: 'REVYX — Sistemul de execuție al agentului imobiliar',
    description:
      'Nu un CRM. Instrumentul care îți spune ce să faci acum. Încearcă demo-ul și primești un an gratuit dacă participi la dezvoltare.',
    type: 'website',
    locale: 'ro_MD',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&family=Montserrat:wght@300;400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a
          href="#feedback"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-gold focus:px-sp2 focus:py-1 focus:text-navy-deep"
        >
          Sări la formularul de participare
        </a>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
