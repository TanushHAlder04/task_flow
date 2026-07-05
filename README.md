# 📝 TaskFlow

A **modern, feature-rich Todo application** built with **React 19** and **Tailwind CSS 4**.  
Manage your tasks with a beautiful, responsive dashboard-style interface featuring sidebar navigation, task detail panels, dark mode, and localStorage persistence.

---

## ✨ Features

### 🎯 Core Functionality
- 📌 **Create & Manage Tasks** — Add, edit, delete and manage tasks with ease
- 🧭 **Smart Filtering** — View tasks by Today, Upcoming, or Custom Lists
- 📄 **Task Details Panel** — Edit title, description, list assignment, and due dates
- ✅ **Mark as Complete** — Toggle task completion status
- ⭐ **Star Important Tasks** — Highlight priority tasks with stars
- 🔍 **Search Tasks** — Quickly find tasks with intelligent live suggestions

### 📋 Organization
- **Custom Lists** — Create unlimited custom lists with color coding
- **Today & Upcoming Views** — Automatic filtering based on due dates
- **Task Counts** — Real-time count badges for each section
- **Overdue Detection** — Visual indicators for overdue tasks

### 🎨 User Experience
- **Dark Mode** — Beautiful dark theme with persistent preference
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** — Polished transitions and hover effects
- **Keyboard Shortcuts** — Enter to save, Escape to cancel
- **Custom Dialogs** — Polished confirmation modals (no browser alerts)
- **Persistent Storage** — All data saved to localStorage

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Lucide React** | Icon library |
| **localStorage API** | Client-side data persistence |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or later)
- **npm** (v9 or later)

### Installation

```bash
# Clone the repository
git clone https://github.com/TanushHAlder04/task_flow.git

# Navigate to the project
cd task_flow

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```
task_flow/
├── public/
│   └── todo-list-svgrepo-com.svg   # Favicon
├── src/
│   ├── components/
│   │   ├── ConfirmDialog.jsx       # Custom confirmation modal
│   │   ├── Header.jsx              # Header with title & dark mode toggle
│   │   ├── Sidebar.jsx             # Sidebar navigation & search
│   │   ├── TaskDetail.jsx          # Task detail/edit panel
│   │   └── TaskList.jsx            # Task list with cards
│   ├── context/
│   │   └── AppContext.jsx          # Central state provider
│   ├── hooks/
│   │   ├── useLocalStorage.js      # localStorage sync with error handling
│   │   ├── useLists.js             # List state & operations
│   │   ├── useTaskFilters.js       # Filtering, search & navigation
│   │   ├── useTasks.js             # Task CRUD operations
│   │   └── useTheme.js             # Dark mode management
│   ├── App.jsx                     # Main layout component
│   ├── index.css                   # Global styles & scrollbar
│   └── main.jsx                    # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎮 Usage

### Creating Tasks
1. Click the **"Add New Task"** button
2. Type your task title
3. Press **Enter** or click **Add Task**
4. The task will be created with:
   - Today's date (if in Today view)
   - Tomorrow's date (if in Upcoming view)
   - No date (if in a List view)

### Editing Tasks
1. Click on any task to open the details panel
2. Edit the title, description, list, or due date
3. Click **"Save Changes"** to update
4. The panel will automatically close

### Managing Lists
1. In the sidebar, scroll to the **Lists** section
2. Click **"Add New List"**
3. Enter a list name and press **Enter**
4. New lists get a random color automatically

### Filtering Tasks
- **Today** — Shows tasks due today
- **Upcoming** — Shows tasks with future due dates
- **Lists** — View tasks by specific list

### Search
1. Type in the search box in the sidebar
2. See live suggestions as you type
3. Click a suggestion to select it
4. The app automatically switches to the relevant section

### Dark Mode
Click the sun/moon icon in the header to toggle between light and dark modes. Your preference is saved automatically.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Save/Add task |
| `Escape` | Cancel current action |

## 💾 Data Persistence

All data is automatically saved to your browser's localStorage:
- Tasks
- Custom lists
- Dark mode preference

Your data persists across browser sessions unless you clear your browser data.

---

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "lucide-react": "^0.562.0",
  "tailwindcss": "^4.1.18"
}
```

---

## 🌟 Architecture Highlights

### Custom Hooks
The app uses a clean separation of concerns with custom hooks:
- **`useLocalStorage`** — Reusable localStorage sync with error handling
- **`useTasks`** — All task CRUD operations and state
- **`useLists`** — List management with computed task counts
- **`useTaskFilters`** — Filtering, search, and navigation logic
- **`useTheme`** — Dark mode state and DOM class toggling

### Context API
A single `AppContext` composes all hooks and provides state to the component tree, eliminating prop drilling across components.

---

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Tanush Halder**
- GitHub: [TanushHAlder04](https://github.com/TanushHAlder04)

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern todo applications
- Built with ❤️ using React and Tailwind CSS

---

**Happy Task Managing! 🎉**
