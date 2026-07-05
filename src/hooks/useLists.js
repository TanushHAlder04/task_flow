import { useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

const DEFAULT_LISTS = [
  { id: 'personal', name: 'Personal', color: 'bg-pink-500' },
  { id: 'work', name: 'Work', color: 'bg-teal-500' },
  { id: 'list1', name: 'List 1', color: 'bg-yellow-500' }
];

const LIST_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500',
  'bg-yellow-500', 'bg-purple-500', 'bg-indigo-500',
  'bg-pink-500', 'bg-teal-500', 'bg-orange-500'
];

/**
 * Custom hook for list management.
 * @param {Array} tasks - The tasks array, used to compute counts per list.
 */
function useLists(tasks) {
  const [lists, setLists] = useLocalStorage('lists', DEFAULT_LISTS);

  // Lists enriched with incomplete task counts
  const listsWithCount = useMemo(() => {
    return lists.map(list => ({
      ...list,
      count: tasks.filter(task => task.list === list.id && !task.completed).length
    }));
  }, [lists, tasks]);

  const addList = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const randomColor = LIST_COLORS[Math.floor(Math.random() * LIST_COLORS.length)];

    const newList = {
      id: trimmedName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: trimmedName,
      color: randomColor
    };

    setLists(prev => [...prev, newList]);
  };

  const getListColor = (listId) => {
    const list = lists.find(l => l.id === listId);
    return list ? list.color : 'bg-gray-500';
  };

  return {
    lists,
    listsWithCount,
    addList,
    getListColor
  };
}

export default useLists;
