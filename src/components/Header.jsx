import { Menu, Sun, Moon, Bell, LogIn, LogOut, User } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';

const Header = () => {
  const {
    darkMode,
    toggleDarkMode,
    sidebarOpen,
    setSidebarOpen,
    sectionTitle,
    filteredTasks,
    auth,
    setShowAuthModal,
    showPriorityReminders,
    setShowPriorityReminders,
    priorityCount
  } = useAppContext();

  return (
    <header className={`
      ${darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-white'} 
      shadow-sm sticky top-0 z-30
    `}>
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section */}
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
        
        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Priority Notification Bell */}
          <button
            onClick={() => setShowPriorityReminders(prev => !prev)}
            className={`
              relative p-2 rounded-lg transition-colors
              ${showPriorityReminders
                ? darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }
            `}
            aria-label="Toggle priority reminders"
            title="Priority Task Reminders"
          >
            <Bell size={20} />
            {priorityCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                {priorityCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
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

          {/* User Auth Profile / Login Button */}
          {auth.isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-300 dark:border-gray-800">
              <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold
                ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}
              `}>
                <User size={16} className="text-blue-500" />
                <span className="max-w-28 truncate">{auth.user.name}</span>
              </div>
              <button
                onClick={auth.logout}
                className={`
                  p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10
                `}
                aria-label="Logout"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md transition-all text-sm"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
