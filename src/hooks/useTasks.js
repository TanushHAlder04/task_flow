import { useState, useMemo, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { api } from '../services/api';

function getDefaultTasks() {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return [
    {
      id: 'default-task-1',
      title: 'Research content ideas',
      completed: false,
      list: 'work',
      dueDate: today,
      subtasks: [],
      tags: ['urgent'],
      starred: false
    },
    {
      id: 'default-task-2',
      title: 'Create database',
      completed: false,
      list: 'work',
      dueDate: tomorrowStr,
      subtasks: [],
      tags: [],
      starred: true
    }
  ];
}

/**
 * Custom hook for all task state and operations with strict data isolation.
 * - Guest Mode (!isAuthenticated): Operates STRICTLY in localStorage ('taskflow_guest_tasks') with ZERO API calls.
 * - Authenticated Mode (isAuthenticated): Operates via MongoDB REST API with JWT Bearer token.
 */
function useTasks(isAuthenticated = false, token = null) {
  // Guest tasks stored strictly in localStorage
  const [guestTasks, setGuestTasks] = useLocalStorage('taskflow_guest_tasks', getDefaultTasks());

  // Authenticated tasks stored in memory from MongoDB
  const [apiTasks, setApiTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Active tasks based on authentication mode
  const tasks = useMemo(() => {
    return isAuthenticated && token ? apiTasks : guestTasks;
  }, [isAuthenticated, token, apiTasks, guestTasks]);

  // Fetch tasks from API strictly when authenticated with a valid token
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    let isMounted = true;
    api.getTasks()
      .then(data => {
        if (isMounted && Array.isArray(data)) {
          const formatted = data.map(t => ({
            ...t,
            id: t._id || t.id
          }));
          setApiTasks(formatted);
        }
      })
      .catch(err => {
        console.error('API getTasks error:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

  // Derive selected task from active tasks
  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tasks.find(t => (t.id === selectedTaskId || t._id === selectedTaskId)) || null;
  }, [tasks, selectedTaskId]);

  const today = new Date().toISOString().split('T')[0];

  const addTask = async (title, activeSection, filter, selectedList) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    let dueDate = null;
    if (activeSection === 'filter') {
      if (filter === 'today') {
        dueDate = today;
      } else if (filter === 'upcoming') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate = tomorrow.toISOString().split('T')[0];
      }
    }

    const listName = activeSection === 'list' && selectedList !== 'all' ? selectedList : 'personal';

    // Authenticated Mode: Send to MongoDB
    if (isAuthenticated && token) {
      try {
        const apiTask = await api.createTask(trimmedTitle, listName, dueDate);
        const newTask = { ...apiTask, id: apiTask._id || apiTask.id };
        setApiTasks(prev => [newTask, ...prev]);
      } catch (err) {
        console.error('API createTask failed:', err);
      }
      return;
    }

    // Guest Mode: strictly localStorage
    const newTask = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      list: listName,
      dueDate,
      subtasks: [],
      tags: [],
      starred: false
    };

    setGuestTasks(prev => [newTask, ...prev]);
  };

  const toggleComplete = async (taskId) => {
    if (isAuthenticated && token) {
      const target = apiTasks.find(t => t.id === taskId || t._id === taskId);
      if (!target) return;
      const updatedCompleted = !target.completed;
      try {
        await api.updateTask(target._id || taskId, { completed: updatedCompleted });
        setApiTasks(prev => prev.map(task =>
          (task.id === taskId || task._id === taskId)
            ? { ...task, completed: updatedCompleted }
            : task
        ));
      } catch (err) {
        console.error('API updateTask failed:', err);
      }
      return;
    }

    // Guest Mode: strictly localStorage
    setGuestTasks(prev => prev.map(task =>
      (task.id === taskId || task._id === taskId)
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = async (taskId) => {
    if (isAuthenticated && token) {
      const target = apiTasks.find(t => t.id === taskId || t._id === taskId);
      if (target) {
        try {
          await api.deleteTask(target._id || taskId);
          setApiTasks(prev => prev.filter(task => (task.id !== taskId && task._id !== taskId)));
        } catch (err) {
          console.error('API deleteTask failed:', err);
        }
      }
    } else {
      // Guest Mode: strictly localStorage
      setGuestTasks(prev => prev.filter(task => (task.id !== taskId && task._id !== taskId)));
    }

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const toggleStar = async (taskId) => {
    if (isAuthenticated && token) {
      const target = apiTasks.find(t => t.id === taskId || t._id === taskId);
      if (!target) return;
      const updatedStarred = !target.starred;
      try {
        await api.updateTask(target._id || taskId, { starred: updatedStarred });
        setApiTasks(prev => prev.map(task =>
          (task.id === taskId || task._id === taskId)
            ? { ...task, starred: updatedStarred }
            : task
        ));
      } catch (err) {
        console.error('API updateTask failed:', err);
      }
      return;
    }

    // Guest Mode: strictly localStorage
    setGuestTasks(prev => prev.map(task =>
      (task.id === taskId || task._id === taskId)
        ? { ...task, starred: !task.starred }
        : task
    ));
  };

  const addSubtask = async (taskId, subtaskTitle) => {
    if (!subtaskTitle.trim()) return;

    const newSubtask = {
      id: crypto.randomUUID(),
      title: subtaskTitle.trim(),
      completed: false
    };

    if (isAuthenticated && token) {
      const target = apiTasks.find(t => t.id === taskId || t._id === taskId);
      if (!target) return;
      const updatedSubtasks = [...(target.subtasks || []), newSubtask];
      try {
        await api.updateTask(target._id || taskId, { subtasks: updatedSubtasks });
        setApiTasks(prev => prev.map(task =>
          (task.id === taskId || task._id === taskId)
            ? { ...task, subtasks: updatedSubtasks }
            : task
        ));
      } catch (err) {
        console.error('API addSubtask failed:', err);
      }
      return;
    }

    // Guest Mode: strictly localStorage
    setGuestTasks(prev => prev.map(task => {
      if (task.id === taskId || task._id === taskId) {
        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    }));
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    if (isAuthenticated && token) {
      const target = apiTasks.find(t => t.id === taskId || t._id === taskId);
      if (!target) return;
      const updatedSubtasks = (target.subtasks || []).map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      try {
        await api.updateTask(target._id || taskId, { subtasks: updatedSubtasks });
        setApiTasks(prev => prev.map(task =>
          (task.id === taskId || task._id === taskId)
            ? { ...task, subtasks: updatedSubtasks }
            : task
        ));
      } catch (err) {
        console.error('API toggleSubtask failed:', err);
      }
      return;
    }

    // Guest Mode: strictly localStorage
    setGuestTasks(prev => prev.map(task => {
      if (task.id === taskId || task._id === taskId) {
        const updatedSubtasks = (task.subtasks || []).map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    }));
  };

  const updateTask = async (taskId, updates) => {
    if (isAuthenticated && token) {
      try {
        await api.updateTask(taskId, updates);
        setApiTasks(prev => prev.map(task =>
          (task.id === taskId || task._id === taskId)
            ? { ...task, ...updates }
            : task
        ));
      } catch (err) {
        console.error('API updateTask failed:', err);
      }
      return;
    }

    // Guest Mode: strictly localStorage
    setGuestTasks(prev => prev.map(task =>
      (task.id === taskId || task._id === taskId)
        ? { ...task, ...updates }
        : task
    ));
  };

  const selectTask = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const clearSelectedTask = () => {
    setSelectedTaskId(null);
  };

  return {
    tasks,
    selectedTask,
    selectedTaskId,
    addTask,
    toggleComplete,
    deleteTask,
    toggleStar,
    addSubtask,
    toggleSubtask,
    updateTask,
    selectTask,
    clearSelectedTask
  };
}

export default useTasks;
