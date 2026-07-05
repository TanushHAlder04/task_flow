import { useState, useMemo, useEffect } from 'react';

/**
 * Custom hook for task filtering, searching, and navigation state.
 * @param {Array} tasks - The full tasks array
 * @param {Array} lists - The lists array (for section title computation)
 */
function useTaskFilters(tasks, lists) {
  const [activeSection, setActiveSection] = useState('filter');
  const [filter, setFilter] = useState('today');
  const [selectedList, setSelectedList] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery, tasks]);

  // Filtered tasks based on active section
  const filteredTasks = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults;
    }

    return tasks.filter(task => {
      if (activeSection === 'filter') {
        if (filter === 'today') {
          return task.dueDate === today;
        }
        if (filter === 'upcoming') {
          return task.dueDate && task.dueDate > today;
        }
      }

      if (activeSection === 'list') {
        return selectedList === 'all' || task.list === selectedList;
      }

      return true;
    });
  }, [tasks, activeSection, filter, selectedList, today, searchQuery, searchResults]);

  // Current section title
  const sectionTitle = useMemo(() => {
    if (searchQuery) return 'Search Results';
    if (activeSection === 'filter') {
      return filter === 'today' ? 'Today' : 'Upcoming';
    }
    if (activeSection === 'list') {
      const list = lists.find(l => l.id === selectedList);
      return list ? list.name : 'All Tasks';
    }
    return 'Tasks';
  }, [activeSection, filter, selectedList, lists, searchQuery]);

  // Auto-switch section when searching
  useEffect(() => {
    if (!searchQuery || searchResults.length === 0) return;

    const task = searchResults[0];

    if (task.dueDate === today) {
      setFilter('today');
      setActiveSection('filter');
    } else if (task.dueDate && task.dueDate > today) {
      setFilter('upcoming');
      setActiveSection('filter');
    } else {
      setSelectedList(task.list);
      setActiveSection('list');
    }
  }, [searchQuery, searchResults, today]);

  // Handle filter selection (clears search)
  const handleFilterClick = (filterType) => {
    setFilter(filterType);
    setActiveSection('filter');
    setSearchQuery('');
  };

  // Handle list selection (clears search)
  const handleListClick = (listId) => {
    setSelectedList(listId);
    setActiveSection('list');
    setSearchQuery('');
  };

  return {
    activeSection,
    filter,
    selectedList,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    searchResults,
    sectionTitle,
    handleFilterClick,
    handleListClick
  };
}

export default useTaskFilters;
