import { useAppContext } from '../context/AppContext';

/**
 * Custom confirmation dialog replacing window.confirm().
 * Renders a centered overlay with a message and confirm/cancel buttons.
 */
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  const { darkMode } = useAppContext();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className={`
        relative z-10 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4
        transform transition-all
        ${darkMode 
          ? 'bg-gray-900 border border-gray-700' 
          : 'bg-white'
        }
      `}>
        <p className={`
          text-base font-medium mb-6
          ${darkMode ? 'text-gray-200' : 'text-gray-700'}
        `}>
          {message}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`
              flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors
              ${darkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
