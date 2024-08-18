import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToasterProvider } from '@/lib/ToasterProvider';
import '../../globals.css';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin page',
  description: 'Data about Website',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ToasterProvider />
        <div className='flex max-lg:flex-col'>
          <Sidebar />
          <TopNavBar />
          <div className='flex-1'>{children}</div>
        </div>
      </body>
    </html>
  );
}
