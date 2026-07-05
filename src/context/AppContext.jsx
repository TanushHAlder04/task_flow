import { createContext, useContext, useState } from 'react';
import useTheme from '../hooks/useTheme';
import useTasks from '../hooks/useTasks';
import useLists from '../hooks/useLists';
import useTaskFilters from '../hooks/useTaskFilters';

const AppContext = createContext(null);

/**
 * Central provider that composes all custom hooks and exposes
 * them to the component tree via context.
 */
export function AppProvider({ children }) {
  // Theme
  const theme = useTheme();

  // Sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tasks (core data)
  const taskManager = useTasks();

  // Lists (depends on tasks for counts)
  const listManager = useLists(taskManager.tasks);

  // Filters (depends on tasks and lists)
  const filterManager = useTaskFilters(taskManager.tasks, listManager.lists);

  const value = {
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

/**
 * Hook to consume the app context.
 * Throws if used outside AppProvider.
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
