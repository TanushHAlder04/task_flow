import { Check, Calendar, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TaskList = ({ tasks }) => {
  const {
    darkMode,
    toggleComplete,
    toggleStar,
    selectTask,
    getListColor
  } = useAppContext();
  
  // Format date in a readable way
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Check if task is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const taskDate = new Date(dateString);
    const today = new Date();
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className={`
        rounded-xl p-12 text-center
        ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-md'}
      `}>
        <CheckCircle2 
          size={48} 
          className={`mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} 
        />
        <h3 className={`text-lg font-semibold mb-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          No tasks here
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const overdueTask = !task.completed && isOverdue(task.dueDate);
        const completedSubtasks = task.subtasks.filter(st => st.completed).length;
        const totalSubtasks = task.subtasks.length;
        
        return (
          <div
            key={task.id}
            onClick={() => selectTask(task.id)}
            className={`
              rounded-xl p-4 cursor-pointer 
              transition-all duration-200 shadow-md
              transform hover:-translate-y-0.5
              ${darkMode 
                ? 'bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-gray-700' 
                : 'bg-white hover:shadow-xl'
              }
              ${task.completed ? 'opacity-75' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(task.id);
                }}
                className={`
                  mt-0.5 w-5 h-5 rounded-md border-2 
                  flex items-center justify-center 
                  transition-all shrink-0
                  ${task.completed 
                    ? 'bg-blue-500 border-blue-500 scale-105' 
                    : darkMode
                      ? 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/10'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }
                `}
                aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {task.completed && (
                  <Check 
                    size={14} 
                    className="text-white" 
                    strokeWidth={3}
                  />
                )}
              </button>
              
              {/* Task Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className={`
                  font-medium mb-1.5 wrap-break-words
                  ${task.completed ? 'line-through' : ''} 
                  ${darkMode ? 'text-gray-200' : 'text-gray-800'}
                  ${task.completed && (darkMode ? 'text-gray-500' : 'text-gray-400')}
                `}>
                  {task.title}
                </h3>
                
                {/* Task Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {/* Due Date */}
                  {task.dueDate && (
                    <span className={`
                      flex items-center gap-1 px-2 py-0.5 rounded-md
                      ${overdueTask
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }
                    `}>
                      <Calendar size={13} />
                      <span className="font-medium">{formatDate(task.dueDate)}</span>
                    </span>
                  )}
                  
                  {/* Subtasks Progress */}
                  {totalSubtasks > 0 && (
                    <span className={`
                      px-2 py-0.5 rounded-md font-medium
                      ${completedSubtasks === totalSubtasks
                        ? darkMode
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-green-100 text-green-700'
                        : darkMode
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {completedSubtasks}/{totalSubtasks} subtasks
                    </span>
                  )}
                  
                  {/* List Badge */}
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${getListColor(task.list)}`}></div>
                    <span className={`
                      capitalize text-xs font-medium
                      ${darkMode ? 'text-gray-500' : 'text-gray-500'}
                    `}>
                      {task.list}
                    </span>
                  </div>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {task.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className={`
                            px-2 py-0.5 rounded-md text-xs font-medium
                            ${darkMode
                              ? 'bg-purple-900/30 text-purple-400'
                              : 'bg-purple-100 text-purple-700'
                            }
                          `}
                        >
                          #{tag}
                        </span>
                      ))}
                      {task.tags.length > 2 && (
                        <span className={`
                          text-xs
                          ${darkMode ? 'text-gray-500' : 'text-gray-400'}
                        `}>
                          +{task.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Star Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(task.id);
                }}
                className={`
                  mt-0.5 p-1 rounded-lg transition-all shrink-0
                  ${task.starred
                    ? darkMode
                      ? 'hover:bg-yellow-900/20'
                      : 'hover:bg-yellow-50'
                    : darkMode
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-gray-100'
                  }
                `}
                aria-label={task.starred ? 'Remove star' : 'Add star'}
              >
                <Star 
                  size={18} 
                  className={
                    task.starred 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : darkMode
                        ? 'text-gray-600'
                        : 'text-gray-300'
                  } 
                />
              </button>
              
              {/* Chevron */}
              <ChevronRight 
                className={`
                  mt-0.5 shrink-0
                  ${darkMode ? 'text-gray-600' : 'text-gray-400'}
                `} 
                size={20} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
