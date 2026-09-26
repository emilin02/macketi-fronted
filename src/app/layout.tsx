import { Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'Macketi — Tus compras, más cerca',
  description:
    'Compra hoy. Recibe en casa. Supermercados, farmacias, restaurantes y tiendas en Malabo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <Header />
          <TopNav />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}