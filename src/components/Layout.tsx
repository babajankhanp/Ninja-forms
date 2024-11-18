import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout as LayoutIcon, Moon, Sun, Plus } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const Layout: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <header className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <LayoutIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className={`ml-2 text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Dynamic Form Builder</h1>
            </Link>
            <div className="flex items-center gap-4">
              {isHome && (
                <Link
                  to="/new"
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors duration-200`}
                >
                  <Plus size={20} className="mr-1" />
                  New Form
                </Link>
              )}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? 'text-yellow-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={`bg-gray-800 text-white text-center py-4 mt-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-50 text-gray-900'
      }`}>
        <p>&copy; 2024 Babajan Patan. All rights reserved.</p>
         <div className='flex justify-around m-0 p-2'>
           <a href="mailto:babajank98@gmail.com" className="text-blue-400 hover:text-blue-600">
           Contact
          </a>
         <a href="https://github.com/babajankhanp" className="text-blue-400 hover:text-blue-600">
            GitHub
         </a>
          <a href="https://www.linkedin.com/in/babajan-patan" className="text-blue-400 hover:text-blue-600">
            LinkedIn
          </a>
         </div>
      </footer>
    </div>
  );
};
