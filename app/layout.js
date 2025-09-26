import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Alpha Points Calculator',
  description: 'Estimate your Binance Alpha Points from trading volume.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 flex items-center justify-center min-h-screen p-4`}>{children}</body>
    </html>
  );
}
