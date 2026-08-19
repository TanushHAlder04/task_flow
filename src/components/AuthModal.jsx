import { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { darkMode, auth } = useAppContext();
  const [isLoginView, setIsLoginView] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password.trim()) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!isLoginView && !name.trim()) {
      setFormError('Please enter your name');
      return;
    }

    try {
      if (isLoginView) {
        await auth.login(email.trim(), password);
      } else {
        await auth.signup(name.trim(), email.trim(), password);
      }
      // Reset & close
      setName('');
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please check credentials or backend server status.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className={`
        relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all
        ${darkMode ? 'bg-gray-900 border border-gray-800 text-white' : 'bg-white text-gray-900'}
      `}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`
            absolute top-4 right-4 p-1.5 rounded-lg transition-colors
            ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}
          `}
          aria-label="Close auth modal"
        >
          <X size={20} />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            onClick={() => { setIsLoginView(true); setFormError(''); }}
            className={`
              flex-1 py-3 font-semibold text-center flex items-center justify-center gap-2
              border-b-2 transition-all
              ${isLoginView 
                ? 'border-blue-500 text-blue-500' 
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }
            `}
          >
            <LogIn size={18} />
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginView(false); setFormError(''); }}
            className={`
              flex-1 py-3 font-semibold text-center flex items-center justify-center gap-2
              border-b-2 transition-all
              ${!isLoginView 
                ? 'border-blue-500 text-blue-500' 
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }
            `}
          >
            <UserPlus size={18} />
            Register
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2 font-medium">
            <AlertCircle size={18} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-xs font-semibold uppercase mb-1 text-gray-500">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={`
                  w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                  }
                `}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className={`
                w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
                ${darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }
              `}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-gray-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`
                w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
                ${darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }
              `}
            />
          </div>

          <button
            type="submit"
            disabled={auth.loading}
            className="w-full py-3 rounded-lg font-semibold bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all disabled:opacity-50 mt-2"
          >
            {auth.loading 
              ? 'Processing...' 
              : isLoginView ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-4">
          JWT Authenticated • Backed by MongoDB
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
