import { useState, useMemo, useEffect } from 'react';
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
 * Custom hook for list management with strict guest/authenticated data isolation.
 * - Guest Mode (!isAuthenticated): Operates STRICTLY in localStorage ('taskflow_guest_lists') with ZERO API calls.
 * - Authenticated Mode (isAuthenticated): Operates via MongoDB REST API with JWT Bearer token.
 */
function useLists(tasks = [], updateTask = null, isAuthenticated = false, token = null) {
  // Guest lists stored strictly in localStorage
  const [guestLists, setGuestLists] = useLocalStorage('taskflow_guest_lists', DEFAULT_LISTS);

  // Authenticated lists stored in memory from MongoDB
  const [apiLists, setApiLists] = useState(DEFAULT_LISTS);

  // Active lists based on authentication mode
  const lists = useMemo(() => {
    return isAuthenticated && token ? apiLists : guestLists;
  }, [isAuthenticated, token, apiLists, guestLists]);

  // Fetch lists from API strictly when authenticated with a valid token
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    let isMounted = true;
    api.getLists()
      .then(data => {
        if (isMounted && Array.isArray(data)) {
          setApiLists(data);
        }
      })
      .catch(err => {
        console.error('API getLists error:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

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

    // Authenticated Mode: Send to MongoDB
    if (isAuthenticated && token) {
      try {
        const newList = await api.createList(trimmedName, randomColor);
        setApiLists(prev => [...prev, {
          id: newList.id,
          name: newList.name,
          color: newList.color,
          isCustom: true
        }]);
      } catch (err) {
        console.error('API createList failed:', err);
      }
      return;
    }

    // Guest Mode: strictly localStorage
    const newList = {
      id: trimmedName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: trimmedName,
      color: randomColor,
      isCustom: true
    };

    setGuestLists(prev => [...prev, newList]);
  };

  const deleteList = async (listId) => {
    // Protection: system default lists cannot be deleted
    if (listId === 'personal' || listId === 'work') {
      return;
    }

    // Authenticated Mode
    if (isAuthenticated && token) {
      try {
        await api.deleteList(listId);
        setApiLists(prev => prev.filter(l => l.id !== listId));
      } catch (err) {
        console.error('API deleteList failed:', err);
      }
    } else {
      // Guest Mode
      setGuestLists(prev => prev.filter(l => l.id !== listId));
    }

    // Reassign any tasks in this list to fallback 'personal' list
    tasks.forEach(task => {
      if (task.list === listId && updateTask) {
        updateTask(task.id || task._id, { list: 'personal' });
      }
    });
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
    getListColor
  };
}

export default useLists;
