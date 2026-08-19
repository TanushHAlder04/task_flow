import { useState } from 'react';
import { X, Trash2, Calendar, List, FileText, Star, CheckSquare, Tag, Plus, Check } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import ConfirmDialog from './ConfirmDialog';

/**
 * Inner editor component — remounts via key={task.id}
 * so local state auto-resets without useEffect.
 */
const TaskDetailEditor = ({ task }) => {
  const {
    darkMode,
    clearSelectedTask,
    deleteTask,
    updateTask,
    lists
  } = useAppContext();

  const [editedTask, setEditedTask] = useState({
    title: task.title || '',
    description: task.description || '',
    list: task.list || 'personal',
    dueDate: task.dueDate || '',
    subtasks: task.subtasks ? [...task.subtasks] : [],
    tags: task.tags ? [...task.tags] : []
  });
  
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newTagText, setNewTagText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [titleError, setTitleError] = useState(false);

  // Handle field changes
  const handleChange = (field, value) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (field === 'title') {
      setTitleError(false);
    }
  };

  // Subtask management
  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSubtask = {
      id: crypto.randomUUID(),
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setEditedTask(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask]
    }));
    setNewSubtaskTitle('');
    setHasChanges(true);
  };

  const handleToggleSubtask = (subtaskId) => {
    setEditedTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    }));
    setHasChanges(true);
  };

  const handleDeleteSubtask = (subtaskId) => {
    setEditedTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
    }));
    setHasChanges(true);
  };

  // Tag management
  const handleAddTag = () => {
    const cleanTag = newTagText.trim().replace(/^#/, '').toLowerCase();
    if (!cleanTag || editedTask.tags.includes(cleanTag)) return;
    setEditedTask(prev => ({
      ...prev,
      tags: [...prev.tags, cleanTag]
    }));
    setNewTagText('');
    setHasChanges(true);
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditedTask(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
    setHasChanges(true);
  };

  // Save changes and close
  const handleSave = () => {
    if (!editedTask.title.trim()) {
      setTitleError(true);
      return;
    }

    updateTask(task.id || task._id, {
      title: editedTask.title.trim(),
      description: editedTask.description.trim(),
      list: editedTask.list,
      dueDate: editedTask.dueDate || null,
      subtasks: editedTask.subtasks,
      tags: editedTask.tags
    });
    
    setHasChanges(false);
    clearSelectedTask();
  };

  // Handle delete with custom confirmation dialog
  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    deleteTask(task.id || task._id);
    setShowConfirmDelete(false);
  };

  const completedSubtasksCount = editedTask.subtasks.filter(st => st.completed).length;

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
        <div className="mb-5">
          <label className={`
            text-sm font-medium mb-1.5 block
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
        <div className="mb-5">
          <label className={`
            text-sm font-medium mb-1.5 block
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
            rows="3"
            placeholder="Add a description..."
          />
        </div>

        {/* Subtasks Section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <CheckSquare size={14} className="inline mr-1" />
              Subtasks
            </label>
            {editedTask.subtasks.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                completedSubtasksCount === editedTask.subtasks.length
                  ? 'bg-green-500/20 text-green-400'
                  : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
                {completedSubtasksCount}/{editedTask.subtasks.length}
              </span>
            )}
          </div>

          {/* Subtask list */}
          <div className="space-y-1.5 mb-2">
            {editedTask.subtasks.map(st => (
              <div 
                key={st.id} 
                className={`group flex items-center justify-between p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-800/80 bg-gray-800/40' : 'hover:bg-gray-100 bg-gray-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggleSubtask(st.id)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                    st.completed 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : darkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}>
                    {st.completed && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span className={`text-sm truncate ${
                    st.completed 
                      ? 'line-through text-gray-400 dark:text-gray-500' 
                      : darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {st.title}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteSubtask(st.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-500 transition-opacity"
                  aria-label="Delete subtask"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Subtask Input */}
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder="Add a subtask..."
              className={`
                flex-1 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500
                ${darkMode 
                  ? 'bg-gray-800 text-white border border-gray-700 placeholder-gray-500' 
                  : 'bg-gray-50 text-gray-900 border border-gray-200 placeholder-gray-400'
                }
              `}
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-2.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mb-5">
          <label className={`
            text-sm font-medium mb-1.5 block
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            <Tag size={14} className="inline mr-1" />
            Tags
          </label>

          {/* Tag pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {editedTask.tags.map(tag => (
              <span
                key={tag}
                className={`
                  inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold
                  ${darkMode ? 'bg-purple-900/40 text-purple-300 border border-purple-800/50' : 'bg-purple-100 text-purple-700'}
                `}
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-purple-900 dark:hover:text-purple-100"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          {/* Add Tag Input */}
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newTagText}
              onChange={(e) => setNewTagText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Tag name (e.g. urgent, feature)..."
              className={`
                flex-1 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500
                ${darkMode 
                  ? 'bg-gray-800 text-white border border-gray-700 placeholder-gray-500' 
                  : 'bg-gray-50 text-gray-900 border border-gray-200 placeholder-gray-400'
                }
              `}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Tag
            </button>
          </div>
        </div>

        {/* List Selection */}
        <div className="mb-5">
          <label className={`
            text-sm font-medium mb-1.5 block
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
            text-sm font-medium mb-1.5 block
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            <Calendar size={14} className="inline mr-1" />
            Due Date
          </label>
          <input
            type="date"
            value={editedTask.dueDate || ''}
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

const TaskDetail = () => {
  const { darkMode, selectedTask: task } = useAppContext();

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

  return <TaskDetailEditor key={task.id || task._id} task={task} />;
};

export default TaskDetail;
