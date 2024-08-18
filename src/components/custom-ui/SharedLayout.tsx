import Navbar from '@/components/custom-ui/Navbar';
import Footer from '@/components/custom-ui/Footer';

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
