import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'REVYX — Real Estate Execution Intelligence',
  description:
    'REVYX Agent Operating System (AOS) — M0.S1 design-system preview. Lead Scoring · Matching · Deal Pipeline.',
  applicationName: 'REVYX',
  authors: [{ name: 'ITPRO SYSTEM SRL' }],
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-gold focus:text-navy-deep focus:px-sp2 focus:py-1 focus:rounded-md"
        >
          Sări la conținutul principal
        </a>
        {children}
      </body>
    </html>
  );
}
