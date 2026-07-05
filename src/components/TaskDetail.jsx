import { useState, useEffect } from 'react';
import { X, Trash2, Calendar, List, FileText, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ConfirmDialog from './ConfirmDialog';

const TaskDetail = () => {
  const {
    darkMode,
    selectedTask: task,
    clearSelectedTask,
    deleteTask,
    updateTask,
    lists
  } = useAppContext();

  // Local state for editing
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    list: '',
    dueDate: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [titleError, setTitleError] = useState(false);

  // Initialize local state when task changes
  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title || '',
        description: task.description || '',
        list: task.list || 'personal',
        dueDate: task.dueDate || ''
      });
      setHasChanges(false);
      setTitleError(false);
    }
  }, [task]);

  // Handle field changes
  const handleChange = (field, value) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (field === 'title') {
      setTitleError(false);
    }
  };

  // Save changes and close
  const handleSave = () => {
    if (!editedTask.title.trim()) {
      setTitleError(true);
      return;
    }

    updateTask(task.id, {
      title: editedTask.title.trim(),
      description: editedTask.description.trim(),
      list: editedTask.list,
      dueDate: editedTask.dueDate || null
    });
    
    setHasChanges(false);
    clearSelectedTask();
  };

  // Handle delete with custom confirmation dialog
  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    deleteTask(task.id);
    setShowConfirmDelete(false);
  };

  // Empty state
  if (!task) {
    return (
      <div className={`
        rounded-xl p-8 shadow-lg text-center sticky top-24
        ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}
      `}>
        <FileText 
          size={48} 
          className={`mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}
        />
        <p className={`font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Select a task to view details
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`
        rounded-xl p-6 shadow-lg sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto
        ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}
      `}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Task Details
            </h3>
            {task.starred && (
              <Star size={18} className="fill-yellow-400 text-yellow-400" />
            )}
          </div>
          <button 
            onClick={clearSelectedTask}
            className={`
              p-1.5 rounded-lg transition-colors
              ${darkMode 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }
            `}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className={`
            text-sm font-medium mb-2 block
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            <FileText size={14} className="inline mr-1" />
            Title
          </label>
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`
              w-full rounded-lg px-4 py-2.5 font-medium
              focus:outline-none focus:ring-2 transition-all
              ${titleError 
                ? 'ring-2 ring-red-500 border-red-500' 
                : 'focus:ring-blue-500'
              }
              ${darkMode 
                ? 'bg-gray-800 text-white border border-gray-700 focus:border-blue-500' 
                : 'bg-gray-50 text-gray-900 border border-gray-200'
              }
            `}
            placeholder="Task title"
          />
          {titleError && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">
              Task title cannot be empty
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className={`
            text-sm font-medium mb-2 block
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            <FileText size={14} className="inline mr-1" />
            Description
          </label>
          <textarea
            value={editedTask.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className={`
              w-full rounded-lg px-4 py-2.5 resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
              ${darkMode 
                ? 'bg-gray-800 text-white border border-gray-700 focus:border-blue-500 placeholder-gray-600' 
                : 'bg-gray-50 text-gray-900 border border-gray-200 placeholder-gray-400'
              }
            `}
            rows="4"
            placeholder="Add a description..."
          />
        </div>

        {/* List Selection */}
        <div className="mb-6">
          <label className={`
            text-sm font-medium mb-2 block
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            <List size={14} className="inline mr-1" />
            List
          </label>
          <select 
            value={editedTask.list}
            onChange={(e) => handleChange('list', e.target.value)}
            className={`
              w-full rounded-lg px-4 py-2.5 capitalize cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
              ${darkMode 
                ? 'bg-gray-800 text-white border border-gray-700 focus:border-blue-500' 
                : 'bg-gray-50 text-gray-900 border border-gray-200'
              }
            `}
          >
            {lists.map(list => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label className={`
            text-sm font-medium mb-2 block
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            <Calendar size={14} className="inline mr-1" />
            Due Date
          </label>
          <input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className={`
              w-full rounded-lg px-4 py-2.5 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
              ${darkMode 
                ? 'bg-gray-800 text-white border border-gray-700 focus:border-blue-500' 
                : 'bg-gray-50 text-gray-900 border border-gray-200'
              }
            `}
          />
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-2 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={handleDelete}
            className={`
              flex-1 px-4 py-2.5 rounded-lg transition-all
              flex items-center justify-center gap-2 font-medium
              ${darkMode
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900'
                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              }
            `}
          >
            <Trash2 size={16} />
            Delete
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={`
              flex-1 px-4 py-2.5 rounded-lg transition-all font-medium
              ${hasChanges
                ? 'bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]'
                : darkMode
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {hasChanges ? 'Save Changes' : 'No Changes'}
          </button>
        </div>
      </div>

      {/* Custom Delete Confirmation Dialog */}
      {showConfirmDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </>
  );
};

export default TaskDetail;
