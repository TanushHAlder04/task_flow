import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppContext } from './hooks/useAppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import AuthModal from './components/AuthModal';
import PriorityReminders from './components/PriorityReminders';

function App() {
  const {
    darkMode,
    sidebarOpen,
    activeSection,
    filter,
    selectedList,
    filteredTasks,
    addTask,
    showAuthModal,
    setShowAuthModal,
    showPriorityReminders,
    setShowPriorityReminders
  } = useAppContext();

  // New task form state (local to this component)
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, activeSection, filter, selectedList);
    setNewTaskTitle('');
    setShowNewTask(false);
  };

  const handleNewTaskKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setShowNewTask(false);
      setNewTaskTitle('');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-950 text-white' 
        : 'bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
    }`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <Header />

        {/* Tasks Container */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Priority Task Reminders Banner */}
          <PriorityReminders 
            isOpen={showPriorityReminders} 
            onClose={() => setShowPriorityReminders(false)} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Column */}
            <div className="lg:col-span-2 space-y-3">
              {/* Add Task Button/Form */}
              {showNewTask ? (
                <div className={`
                  rounded-xl p-4 shadow-lg border-2 border-blue-500
                  ${darkMode ? 'bg-gray-900' : 'bg-white'}
                `}>
                  <input
                    type="text"
                    placeholder="Task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleNewTaskKeyDown}
                    autoFocus
                    className={`
                      w-full rounded-lg px-4 py-2 focus:outline-none
                      ${darkMode 
                        ? 'bg-gray-800 text-white placeholder-gray-500' 
                        : 'bg-gray-50 text-gray-900'
                      }
                    `}
                  />
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={handleAddTask} 
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Add Task
                    </button>
                    <button 
                      onClick={() => {
                        setShowNewTask(false);
                        setNewTaskTitle('');
                      }} 
                      className={`
                        px-4 py-2 rounded-lg transition-colors font-medium
                        ${darkMode 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }
                      `}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewTask(true)}
                  className={`
                    w-full rounded-xl p-4 flex items-center gap-3 
                    transition-all shadow-md hover:shadow-lg
                    ${darkMode 
                      ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800' 
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <Plus className="text-blue-500" size={20} />
                  <span className={`font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Add New Task
                  </span>
                </button>
              )}

              {/* Task List */}
              <TaskList tasks={filteredTasks} />
            </div>

            {/* Task Detail Column */}
            <div className="lg:col-span-1">
              <TaskDetail />
            </div>
          </div>
        </div>
      </div>

      {/* User Login/Register Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}

export default App;
