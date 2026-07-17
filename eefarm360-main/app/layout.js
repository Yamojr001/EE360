import './globals.css';

export const metadata = {
  title: 'EEFarm360',
  description:
    'Integrated agribusiness in Sharifai, Dutse, Jigawa State offering farm management, catfish, poultry, eggs, rabbit, pigeon, livestock and Yateem water.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
