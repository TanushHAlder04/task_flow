import { useState, useMemo, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useTasks from '../hooks/useTasks';
import useLists from '../hooks/useLists';
import useTaskFilters from '../hooks/useTaskFilters';
import { useAuth } from '../hooks/useAuth';
import { AppContext } from '../hooks/useAppContext';

/**
 * Central provider that composes custom hooks, authentication,
 * priority task reminders, and backend API integration with strict data isolation.
 */
export function AppProvider({ children }) {
  // Authentication hook (user, token, isAuthenticated)
  const auth = useAuth();

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Priority Reminders Panel Toggle State
  const [showPriorityReminders, setShowPriorityReminders] = useState(false);

  // Theme hook (strictly isolated: guest in localStorage, authenticated in MongoDB)
  const theme = useTheme(auth.isAuthenticated, auth.token);

  // Sync user theme preference when user profile loads from backend
  const userDarkMode = auth.user?.darkMode;
  const setDarkMode = theme.setDarkMode;
  useEffect(() => {
    if (typeof userDarkMode === 'boolean') {
      setDarkMode(userDarkMode);
    }
  }, [userDarkMode, setDarkMode]);

  // Sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tasks (strictly isolated: guest in localStorage, authenticated in MongoDB)
  const taskManager = useTasks(auth.isAuthenticated, auth.token);

  // Lists (strictly isolated: guest in localStorage, authenticated in MongoDB)
  const listManager = useLists(taskManager.tasks, taskManager.updateTask, auth.isAuthenticated, auth.token);

  // Filters (depends on active tasks and lists)
  const filterManager = useTaskFilters(taskManager.tasks, listManager.lists);

  // Priority Count (Starred, Urgent, or Overdue/Due Today)
  const today = new Date().toISOString().split('T')[0];
  const priorityCount = useMemo(() => {
    return taskManager.tasks.filter(task => {
      if (task.completed) return false;
      const isStarred = task.starred;
      const isUrgent = task.tags && task.tags.some(tag => tag.toLowerCase() === 'urgent');
      const isDueToday = task.dueDate === today;
      const isOverdue = task.dueDate && task.dueDate < today;

      return isStarred || isUrgent || isDueToday || isOverdue;
    }).length;
  }, [taskManager.tasks, today]);

  const value = {
    // Auth
    auth,
    showAuthModal,
    setShowAuthModal,

    // Priority Reminders
    showPriorityReminders,
    setShowPriorityReminders,
    priorityCount,

    // Theme
    darkMode: theme.darkMode,
    toggleDarkMode: theme.toggleDarkMode,

    // Sidebar
    sidebarOpen,
    setSidebarOpen,

    // Tasks
    tasks: taskManager.tasks,
    selectedTask: taskManager.selectedTask,
    selectedTaskId: taskManager.selectedTaskId,
    addTask: taskManager.addTask,
    toggleComplete: taskManager.toggleComplete,
    deleteTask: taskManager.deleteTask,
    toggleStar: taskManager.toggleStar,
    addSubtask: taskManager.addSubtask,
    toggleSubtask: taskManager.toggleSubtask,
    updateTask: taskManager.updateTask,
    selectTask: taskManager.selectTask,
    clearSelectedTask: taskManager.clearSelectedTask,

    // Lists
    lists: listManager.lists,
    listsWithCount: listManager.listsWithCount,
    addList: listManager.addList,
    deleteList: listManager.deleteList,
    getListColor: listManager.getListColor,

    // Filters & Navigation
    activeSection: filterManager.activeSection,
    filter: filterManager.filter,
    selectedList: filterManager.selectedList,
    searchQuery: filterManager.searchQuery,
    setSearchQuery: filterManager.setSearchQuery,
    filteredTasks: filterManager.filteredTasks,
    searchResults: filterManager.searchResults,
    sectionTitle: filterManager.sectionTitle,
    handleFilterClick: filterManager.handleFilterClick,
    handleListClick: filterManager.handleListClick
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
