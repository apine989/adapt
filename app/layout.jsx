import './globals.css';

export const metadata = {
  title: 'AdApt',
  description: 'AI ad campaign generator for small e-commerce brands'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
