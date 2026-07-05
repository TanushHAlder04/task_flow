import { useState, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

const DEFAULT_TASKS = [
  {
    id: 'default-task-1',
    title: 'Research content ideas',
    completed: false,
    list: 'work',
    dueDate: '2026-02-20',
    subtasks: [],
    tags: ['urgent'],
    starred: false
  },
  {
    id: 'default-task-2',
    title: 'Create database',
    completed: false,
    list: 'work',
    dueDate: '2026-02-22',
    subtasks: [],
    tags: [],
    starred: true
  }
];

/**
 * Custom hook for all task state and operations.
 * Stores selectedTaskId (not a copy) to avoid stale-state bugs.
 */
function useTasks() {
  const [tasks, setTasks] = useLocalStorage('tasks', DEFAULT_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Derive the selected task from the tasks array — always fresh
  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tasks.find(t => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  const today = new Date().toISOString().split('T')[0];

  const addTask = (title, activeSection, filter, selectedList) => {
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

    const newTask = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      list: activeSection === 'list' && selectedList !== 'all'
        ? selectedList
        : 'personal',
      dueDate,
      subtasks: [],
      tags: [],
      starred: false
    };

    setTasks(prev => [...prev, newTask]);
  };

  const toggleComplete = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const toggleStar = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, starred: !task.starred }
        : task
    ));
  };

  const addSubtask = (taskId, subtaskTitle) => {
    if (!subtaskTitle.trim()) return;

    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: [
            ...task.subtasks,
            {
              id: crypto.randomUUID(),
              title: subtaskTitle.trim(),
              completed: false
            }
          ]
        };
      }
      return task;
    }));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(subtask =>
            subtask.id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask
          )
        };
      }
      return task;
    }));
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
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
