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
 * Custom hook for all task state and operations.
 * Connects with Express backend API when authenticated.
 */
function useTasks(isAuthenticated = false) {
  const [tasks, setTasks] = useLocalStorage('tasks', getDefaultTasks());
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Fetch tasks from API when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.getTasks()
        .then(apiTasks => {
          if (Array.isArray(apiTasks)) {
            // Map MongoDB _id to id
            const formatted = apiTasks.map(t => ({
              ...t,
              id: t._id || t.id
            }));
            setTasks(formatted);
          }
        })
        .catch(err => console.warn('API getTasks failed, using local storage:', err));
    }
  }, [isAuthenticated, setTasks]);

  // Derive selected task
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

    if (isAuthenticated) {
      try {
        const apiTask = await api.createTask(trimmedTitle, listName, dueDate);
        const newTask = { ...apiTask, id: apiTask._id };
        setTasks(prev => [newTask, ...prev]);
        return;
      } catch (err) {
        console.warn('API createTask failed, saving locally:', err);
      }
    }

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

    setTasks(prev => [newTask, ...prev]);
  };

  const toggleComplete = async (taskId) => {
    const target = tasks.find(t => t.id === taskId || t._id === taskId);
    if (!target) return;

    const updatedCompleted = !target.completed;

    if (isAuthenticated) {
      try {
        await api.updateTask(target._id || taskId, { completed: updatedCompleted });
      } catch (err) {
        console.warn('API updateTask failed:', err);
      }
    }

    setTasks(prev => prev.map(task =>
      (task.id === taskId || task._id === taskId)
        ? { ...task, completed: updatedCompleted }
        : task
    ));
  };

  const deleteTask = async (taskId) => {
    const target = tasks.find(t => t.id === taskId || t._id === taskId);

    if (isAuthenticated && target) {
      try {
        await api.deleteTask(target._id || taskId);
      } catch (err) {
        console.warn('API deleteTask failed:', err);
      }
    }

    setTasks(prev => prev.filter(task => (task.id !== taskId && task._id !== taskId)));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const toggleStar = async (taskId) => {
    const target = tasks.find(t => t.id === taskId || t._id === taskId);
    if (!target) return;

    const updatedStarred = !target.starred;

    if (isAuthenticated) {
      try {
        await api.updateTask(target._id || taskId, { starred: updatedStarred });
      } catch (err) {
        console.warn('API updateTask failed:', err);
      }
    }

    setTasks(prev => prev.map(task =>
      (task.id === taskId || task._id === taskId)
        ? { ...task, starred: updatedStarred }
        : task
    ));
  };

  const addSubtask = (taskId, subtaskTitle) => {
    if (!subtaskTitle.trim()) return;

    setTasks(prev => prev.map(task => {
      if (task.id === taskId || task._id === taskId) {
        const updatedSubtasks = [
          ...task.subtasks,
          {
            id: crypto.randomUUID(),
            title: subtaskTitle.trim(),
            completed: false
          }
        ];

        if (isAuthenticated) {
          api.updateTask(task._id || taskId, { subtasks: updatedSubtasks })
            .catch(err => console.warn('API updateTask failed:', err));
        }

        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    }));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId || task._id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );

        if (isAuthenticated) {
          api.updateTask(task._id || taskId, { subtasks: updatedSubtasks })
            .catch(err => console.warn('API updateTask failed:', err));
        }

        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    }));
  };

  const updateTask = async (taskId, updates) => {
    if (isAuthenticated) {
      try {
        await api.updateTask(taskId, updates);
      } catch (err) {
        console.warn('API updateTask failed:', err);
      }
    }

    setTasks(prev => prev.map(task =>
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
