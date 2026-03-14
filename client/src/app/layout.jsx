import './globals.css';
import { ReduxProvider } from '../redux/provider';

export const metadata = {
  title: 'Smart Mom',
  description: 'Balance Work & Parenting — Smart child development tracking for working mothers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
