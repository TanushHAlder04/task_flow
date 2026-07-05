import { useState, useMemo } from 'react';
import { Search, ChevronRight, Calendar, Plus, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    darkMode,
    listsWithCount,
    activeSection,
    filter,
    searchQuery,
    setSearchQuery,
    tasks,
    selectedList,
    addList,
    handleFilterClick,
    handleListClick
  } = useAppContext();

  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Calculate task counts
  const taskCounts = useMemo(() => {
    const todayCount = tasks.filter(t => !t.completed && t.dueDate === today).length;
    const upcomingCount = tasks.filter(t => !t.completed && t.dueDate && t.dueDate > today).length;
    return { today: todayCount, upcoming: upcomingCount };
  }, [tasks, today]);

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    return tasks
      .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [tasks, searchQuery]);

  // Handle new list creation
  const handleCreateList = () => {
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
      setShowNewList(false);
    }
  };

  // Handle search suggestion click
  const handleSuggestionClick = (taskTitle) => {
    setSearchQuery(taskTitle);
    setShowSuggestions(false);
  };

  // Determine if "Today" filter is active
  const isTodayActive = activeSection === 'filter' && filter === 'today';
  const isUpcomingActive = activeSection === 'filter' && filter === 'upcoming';

  return (
    <div 
      className={`
        fixed left-0 top-0 h-full 
        ${darkMode ? 'bg-gray-900' : 'bg-white'} 
        shadow-2xl transition-all duration-300 z-40 
        ${sidebarOpen ? 'w-72' : 'w-0'} 
        overflow-hidden
      `}
    >
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Menu
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className={`
              p-1 rounded-lg transition-colors
              ${darkMode 
                ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
              }
            `}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </header>

        {/* Search */}
        <div className="relative mb-6">
          <Search 
            className={`absolute left-3 top-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} 
            size={18} 
          />
          <input
            type="text"
            placeholder="Search Tasks"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className={`
              w-full pl-10 pr-4 py-2.5 rounded-lg 
              transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
              ${darkMode 
                ? 'bg-gray-800 text-white placeholder-gray-500 border border-gray-700' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              }
            `}
          />
          
          {/* Search Suggestions */}
          {showSuggestions && searchQuery && searchSuggestions.length > 0 && (
            <div 
              className={`
                absolute top-full mt-2 w-full rounded-lg shadow-lg 
                max-h-48 overflow-auto z-50
                ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
              `}
            >
              {searchSuggestions.map(task => (
                <button
                  key={task.id}
                  onClick={() => handleSuggestionClick(task.title)}
                  className={`
                    w-full text-left px-4 py-2.5 transition-colors
                    ${darkMode 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-800'
                    }
                  `}
                >
                  {task.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <section className="mb-6">
          <h3 className={`
            text-xs font-semibold uppercase mb-3
            ${darkMode ? 'text-gray-500' : 'text-gray-500'}
          `}>
            Tasks
          </h3>
          <div className="space-y-2">
            {/* Today */}
            <button
              onClick={() => handleFilterClick('today')}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg 
                transition-all
                ${isTodayActive
                  ? darkMode
                    ? 'bg-blue-900/50 text-blue-300'
                    : 'bg-blue-100 text-blue-700'
                  : darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="font-medium">Today</span>
              </div>
              <span className={`
                text-sm px-2 py-0.5 rounded-full
                ${isTodayActive
                  ? darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-700'
                  : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                }
              `}>
                {taskCounts.today}
              </span>
            </button>

            {/* Upcoming */}
            <button
              onClick={() => handleFilterClick('upcoming')}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg 
                transition-all
                ${isUpcomingActive
                  ? darkMode
                    ? 'bg-blue-900/50 text-blue-300'
                    : 'bg-blue-100 text-blue-700'
                  : darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <ChevronRight size={16} />
                <span className="font-medium">Upcoming</span>
              </div>
              <span className={`
                text-sm px-2 py-0.5 rounded-full
                ${isUpcomingActive
                  ? darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-700'
                  : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                }
              `}>
                {taskCounts.upcoming}
              </span>
            </button>
          </div>
        </section>

        {/* Lists Section */}
        <section className="mb-6">
          <h3 className={`
            text-xs font-semibold uppercase mb-3
            ${darkMode ? 'text-gray-500' : 'text-gray-500'}
          `}>
            Lists
          </h3>
          <div className="space-y-2">
            {listsWithCount.map(list => {
              const isListActive = activeSection === 'list' && selectedList === list.id;
              return (
                <button
                  key={list.id}
                  onClick={() => handleListClick(list.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                    transition-all
                    ${isListActive
                      ? darkMode
                        ? 'bg-blue-900/50 text-blue-300'
                        : 'bg-blue-100 text-blue-700'
                      : darkMode
                        ? 'hover:bg-gray-800 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${list.color}`}></div>
                    <span className="font-medium">{list.name}</span>
                  </div>
                  <span className={`
                    text-sm px-2 py-0.5 rounded-full
                    ${isListActive
                      ? darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-700'
                      : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {list.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Add New List */}
        {showNewList ? (
          <div className="flex gap-2">
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              className={`
                flex-1 px-3 py-2.5 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${darkMode 
                  ? 'bg-gray-800 text-white placeholder-gray-500 border border-gray-700' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }
              `}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateList();
                if (e.key === 'Escape') {
                  setShowNewList(false);
                  setNewListName('');
                }
              }}
            />
            <button
              onClick={handleCreateList}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewList(true)}
            className={`
              w-full flex items-center gap-2 px-3 py-2.5 rounded-lg 
              transition-colors
              ${darkMode 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <Plus size={16} />
            <span className="font-medium">Add New List</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
