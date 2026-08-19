import { useMemo } from 'react';
import { Bell, Star, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';

const PriorityReminders = ({ isOpen, onClose }) => {
  const { darkMode, tasks, selectTask } = useAppContext();
  const today = new Date().toISOString().split('T')[0];

  // Filter priority tasks: incomplete tasks that are starred, urgent-tagged, or overdue/due today
  const priorityTasks = useMemo(() => {
    return tasks.filter(task => {
      if (task.completed) return false;
      const isStarred = task.starred;
      const isUrgent = task.tags && task.tags.some(tag => tag.toLowerCase() === 'urgent');
      const isDueToday = task.dueDate === today;
      const isOverdue = task.dueDate && task.dueDate < today;

      return isStarred || isUrgent || isDueToday || isOverdue;
    });
  }, [tasks, today]);

  if (!isOpen) return null;

  return (
    <div className={`
      mb-6 rounded-2xl p-5 shadow-lg border transition-all animate-in fade-in slide-in-from-top-2
      ${darkMode ? 'bg-gray-900 border-amber-500/30' : 'bg-amber-50/70 border-amber-200'}
    `}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
            <Bell size={20} />
          </div>
          <div>
            <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Priority Task Reminders
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {priorityTasks.length > 0 
                ? `${priorityTasks.length} task(s) require your immediate attention` 
                : 'All clear! No priority reminders right now.'
              }
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-amber-100'
          }`}
        >
          Dismiss
        </button>
      </div>

      {priorityTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {priorityTasks.map(task => {
            const isOverdue = task.dueDate && task.dueDate < today;
            const isDueToday = task.dueDate === today;

            return (
              <div
                key={task.id || task._id}
                onClick={() => selectTask(task.id || task._id)}
                className={`
                  p-3 rounded-xl cursor-pointer border transition-all hover:scale-[1.01]
                  flex items-start gap-2.5
                  ${darkMode 
                    ? 'bg-gray-800/90 border-gray-700 hover:border-amber-500/50' 
                    : 'bg-white border-amber-100 hover:border-amber-300 shadow-xs'
                  }
                `}
              >
                <div className="mt-0.5 shrink-0">
                  {task.starred ? (
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    {isOverdue && (
                      <span className="px-2 py-0.5 rounded-md font-semibold bg-red-500/20 text-red-500">
                        Overdue
                      </span>
                    )}
                    {isDueToday && (
                      <span className="px-2 py-0.5 rounded-md font-semibold bg-amber-500/20 text-amber-500 flex items-center gap-1">
                        <Calendar size={12} /> Today
                      </span>
                    )}
                    <span className="capitalize text-gray-400 font-medium">
                      {task.list}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-green-500 font-medium pt-2">
          <CheckCircle2 size={16} />
          <span>Great job! You have zero overdue or urgent priority tasks.</span>
        </div>
      )}
    </div>
  );
};

export default PriorityReminders;
