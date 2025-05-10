import type { Metadata } from 'next';
import { inter, montserrat } from './fonts';
import ThemeProvider from '@/contexts/ThemeContext';
import './styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Validador Facial KYC',
  description: 'Sistema de validação facial para processos KYC',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable}`} >
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <main className="w-full">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}