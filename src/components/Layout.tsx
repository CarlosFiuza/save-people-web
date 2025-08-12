import type { FC, ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-start pt-20 pb-8">
        <div className="w-full px-4">
          {children}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Minha Aplicação
        </div>
      </footer>
    </div>
  );
};

export default Layout;