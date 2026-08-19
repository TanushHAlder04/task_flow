import { useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import { api } from '../services/api';

const DEFAULT_LISTS = [
  { id: 'personal', name: 'Personal', color: 'bg-pink-500', isCustom: false },
  { id: 'work', name: 'Work', color: 'bg-teal-500', isCustom: false }
];

const LIST_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500',
  'bg-yellow-500', 'bg-purple-500', 'bg-indigo-500',
  'bg-pink-500', 'bg-teal-500', 'bg-orange-500'
];

/**
 * Custom hook for list management with backend sync & list deletion.
 * @param {Array} tasks - The tasks array, used to compute counts per list.
 * @param {Function} updateTask - Function to update tasks when reassigning on list delete.
 * @param {boolean} isAuthenticated - Whether user is logged in via JWT.
 */
function useLists(tasks = [], updateTask = null, isAuthenticated = false) {
  const [lists, setLists] = useLocalStorage('lists', DEFAULT_LISTS);

  // Lists enriched with incomplete task counts
  const listsWithCount = useMemo(() => {
    return lists.map(list => ({
      ...list,
      count: tasks.filter(task => task.list === list.id && !task.completed).length
    }));
  }, [lists, tasks]);

  const addList = async (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const randomColor = LIST_COLORS[Math.floor(Math.random() * LIST_COLORS.length)];

    if (isAuthenticated) {
      try {
        const newList = await api.createList(trimmedName, randomColor);
        setLists(prev => [...prev, {
          id: newList.id,
          name: newList.name,
          color: newList.color,
          isCustom: true
        }]);
        return;
      } catch (err) {
        console.warn('API createList failed, falling back to local:', err);
      }
    }

    const newList = {
      id: trimmedName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: trimmedName,
      color: randomColor,
      isCustom: true
    };

    setLists(prev => [...prev, newList]);
  };

  const deleteList = async (listId) => {
    // Protection: system default lists cannot be deleted
    if (listId === 'personal' || listId === 'work') {
      return;
    }

    if (isAuthenticated) {
      try {
        await api.deleteList(listId);
      } catch (err) {
        console.warn('API deleteList failed:', err);
      }
    }

    // Reassign any tasks in this list to fallback 'personal' list
    tasks.forEach(task => {
      if (task.list === listId && updateTask) {
        updateTask(task.id || task._id, { list: 'personal' });
      }
    });

    // Filter out the deleted list
    setLists(prev => prev.filter(l => l.id !== listId));
  };

  const getListColor = (listId) => {
    const list = lists.find(l => l.id === listId);
    return list ? list.color : 'bg-gray-500';
  };

  return {
    lists,
    listsWithCount,
    addList,
    deleteList,
    getListColor,
    setLists
  };
}

export default useLists;
