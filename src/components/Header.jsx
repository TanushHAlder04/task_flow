import { Menu, Sun, Moon, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const {
    darkMode,
    toggleDarkMode,
    sidebarOpen,
    setSidebarOpen,
    sectionTitle,
    filteredTasks
  } = useAppContext();

  return (
    <header className={`
      ${darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-white'} 
      shadow-sm sticky top-0 z-30
    `}>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className={`
                p-2 rounded-lg transition-colors
                ${darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
                }
              `}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
          )}
          <h2 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {sectionTitle}
          </h2>
          <span className={`
            px-3 py-1 rounded-full font-semibold
            ${darkMode 
              ? 'bg-blue-900/50 text-blue-300' 
              : 'bg-blue-100 text-blue-600'
            }
          `}>
            {filteredTasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className={`
              p-2 rounded-lg transition-colors
              ${darkMode 
                ? 'hover:bg-gray-800 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
              }
            `}
            aria-label="Filter tasks"
          >
            <Filter size={20} />
          </button>
          <button
            onClick={toggleDarkMode}
            className={`
              p-2 rounded-lg transition-colors
              ${darkMode 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-900 text-white'
              }
            `}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
