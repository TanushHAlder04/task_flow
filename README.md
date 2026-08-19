# 📝 TaskFlow


A **fullstack, feature-rich Task Management application** built with **React 19**, **Node.js**, **Express**, **MongoDB**, **JWT Authentication**, and **Tailwind CSS 4**.
Manage your tasks with a beautiful dashboard-style interface featuring sidebar navigation, task detail panels, JWT user accounts, priority reminders, dark mode, and seamless cloud database synchronization.

🔗 **Live Demo:** [https://task-flow-gfbk.onrender.com/](https://task-flow-gfbk.onrender.com/)

---

## ✨ Key Features

### 🔐 JWT Authentication & Cloud Persistence
- **User Accounts** — Sign In & Register with email and hashed passwords (`bcryptjs`).
- **JWT Authorization** — Bearer token authorization header with 30-day session security.
- **MongoDB Sync** — User preferences (`darkMode`), custom lists, and tasks persist to MongoDB Cloud/Local DB.
- **Offline/Guest Fallback** — Seamless localStorage mode when unauthenticated.

### 🎯 Core Task Functionality
- 📌 **Create & Manage Tasks** — Add, edit, delete and manage tasks with ease
- 🧭 **Smart Filtering** — View tasks by Today, Upcoming, or Custom Lists
- 📄 **Task Detail Drawer** — Edit title, description, due date, subtasks, tags, and list assignment
- ✅ **Mark as Complete** — Toggle task completion status
- ⭐ **Star Important Tasks** — Highlight priority tasks with stars
- 🔍 **Live Search & Filter** — Instant filtering with intelligent live suggestions

### 📋 Custom List Management & Deletion
- **Initial Defaults** — Built-in `Personal` and `Work` lists
- **Create & Delete Custom Lists** — Create custom lists with color coding, and delete custom lists on hover
- **Safe Task Reassignment** — When a custom list is deleted, tasks are automatically reassigned to the `Personal` list
- **Task Counts** — Real-time count badges for each section
- **Overdue Detection** — Visual indicators for overdue tasks

### 🔔 Priority Task Reminders
- **Header Alert Banner & Bell Badge** — Live reminders for Starred tasks, Urgent tagged tasks, and tasks that are Overdue or Due Today
- **Instant Dismiss & Selection** — Quick jump to priority tasks directly from the alert banner

### 🎨 Modern UX & Design
- **Dark & Light Themes** — Synced across user sessions, with persistent preference
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** — Polished transitions and hover effects
- **Keyboard Shortcuts** — Enter to save, Escape to cancel
- **Custom Dialogs** — Polished confirmation modals (no browser alerts)

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4 | UI & Client application |
| **Backend** | Node.js, Express.js | RESTful API Server |
| **Database** | MongoDB & Mongoose ORM | Persistent Document Database |
| **Authentication** | JWT (`jsonwebtoken`), `bcryptjs` | Token authentication & password hashing |
| **Icons** | Lucide React | Modern SVG icons |
| **Local Persistence** | localStorage API | Offline/guest data persistence |

---

## 🚀 Getting Started & Environment Setup

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or later)
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI)

### 2. Clone the Repository

```bash
git clone https://github.com/TanushHAlder04/task_flow.git
cd task_flow
```

### 3. Environment Configuration

**Backend Environment** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_secret_jwt_key_here
```

**Frontend Environment** (`.env`):
```env
VITE_API_BASE_URL=/api
```
*(Vite automatically proxies `/api` calls directly to the Express server during development)*

### 4. Install Dependencies

```bash
# Install root (frontend) dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

### 5. Run the App

```bash
npm run dev
```

`concurrently` runs both the Vite React app (`http://localhost:5173`) and the Express API (`http://localhost:5000`) simultaneously in the same terminal. All `/api` requests are seamlessly handled through the Vite development proxy.

> **Note:** If you skip the backend/database setup, the app still works fully in **offline/guest mode**, storing everything in your browser's localStorage.

---

## 📂 Project Architecture

```
task_flow/
├── server/                       # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose Connection
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Bearer Token Guard
│   ├── models/
│   │   ├── User.js               # User Schema (name, email, password, darkMode)
│   │   ├── Task.js               # Task Schema (subtasks, tags, starred, list, dueDate)
│   │   └── List.js               # Custom List Schema (listId, name, color)
│   ├── routes/
│   │   ├── auth.js               # Register, Login, Me, Theme routes
│   │   ├── tasks.js              # Task CRUD routes
│   │   └── lists.js              # List CRUD & Deletion routes
│   ├── .env.example
│   └── server.js                 # Express app entry point
├── src/                          # React Frontend
│   ├── components/
│   │   ├── AuthModal.jsx         # Login & Register Modal
│   │   ├── PriorityReminders.jsx # Priority Reminders Banner
│   │   ├── ConfirmDialog.jsx     # Custom confirmation modal
│   │   ├── Header.jsx            # Header with Auth, Bell & Theme toggle
│   │   ├── Sidebar.jsx           # Sidebar navigation, search & list deletion
│   │   ├── TaskDetail.jsx        # Task detail/edit panel
│   │   └── TaskList.jsx          # Task list with cards
│   ├── context/
│   │   └── AppContext.jsx        # Central state provider
│   ├── services/
│   │   └── api.js                # API Client with JWT Authorization headers
│   ├── hooks/
│   │   ├── useAuth.js            # Authentication Hook
│   │   ├── useAppContext.js      # Context Hook
│   │   ├── useLocalStorage.js    # localStorage sync with error handling
│   │   ├── useLists.js           # List state, operations & deletion logic
│   │   ├── useTaskFilters.js     # Filtering, search & navigation
│   │   ├── useTasks.js           # Task CRUD & API sync Hook
│   │   └── useTheme.js           # Dark mode management
│   ├── App.jsx                   # Main layout component
│   ├── index.css                 # Global styles & scrollbar
│   └── main.jsx                  # Entry point
├── public/
│   └── todo-list-svgrepo-com.svg # Favicon
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
1. Click on any task to open the task detail drawer
2. Edit the title, description, list, due date, subtasks, or tags
3. Click **"Save Changes"** to update
4. The panel will automatically close

### Managing Lists
1. In the sidebar, scroll to the **Lists** section
2. Click **"Add New List"**, enter a name, and press **Enter** — new lists get a random color automatically
3. Hover over a custom list to reveal the delete option
4. Deleting a list automatically reassigns its tasks to **Personal**

### Filtering Tasks
- **Today** — Shows tasks due today
- **Upcoming** — Shows tasks with future due dates
- **Lists** — View tasks by specific list (default `Personal` / `Work`, plus any custom lists)

### Priority Reminders
- Check the bell icon or alert banner in the header for Starred, Urgent, Overdue, or Due Today tasks
- Click a reminder to jump straight to that task, or dismiss it instantly

### Search
1. Type in the search box in the sidebar
2. See live suggestions as you type
3. Click a suggestion to select it — the app automatically switches to the relevant section

### Authentication
- Click **Sign In / Register** in the header to create a JWT-secured account
- Signed-in users get their tasks, lists, and dark mode preference synced to MongoDB
- Without signing in, the app falls back to local, browser-only storage

### Dark Mode
Click the sun/moon icon in the header to toggle between light and dark modes. Your preference is saved automatically (synced to your account if signed in, or to localStorage otherwise).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Save/Add task |
| `Escape` | Cancel current action |

---

## 💾 Data Persistence

- **Signed-in users:** Tasks, custom lists, and dark mode preference sync to **MongoDB** via the Express API, accessible across devices.
- **Guest/offline users:** All data is automatically saved to your browser's **localStorage** and persists across sessions unless you clear your browser data.

---

## 🌟 Architecture Highlights

### Custom Hooks
The app uses a clean separation of concerns with custom hooks:
- **`useAuth`** — Authentication state, JWT token handling, and session management
- **`useLocalStorage`** — Reusable localStorage sync with error handling
- **`useTasks`** — Task CRUD operations, including MongoDB API sync
- **`useLists`** — List management with computed task counts and deletion/reassignment logic
- **`useTaskFilters`** — Filtering, search, and navigation logic
- **`useTheme`** — Dark mode state and DOM class toggling

### Context API
A single `AppContext` composes all hooks and provides state to the component tree, eliminating prop drilling across components.

### Backend
A lightweight Express REST API secured with JWT bearer tokens handles authentication, task CRUD, and list CRUD/deletion, backed by MongoDB via Mongoose.

---

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Tanush Halder**
- GitHub: [TanushHAlder04](https://github.com/TanushHAlder04)



---

**Happy Task Managing! 🎉**