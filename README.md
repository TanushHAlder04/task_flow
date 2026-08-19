# 📝 TaskFlow

A **fullstack, feature-rich Task Management application** built with **React 19**, **Node.js**, **Express**, **MongoDB**, **JWT Authentication**, and **Tailwind CSS 4**.  
Manage your tasks with a modern dashboard interface featuring strict Guest/Auth data isolation, custom list deletion, priority reminders, subtasks, tags, dark mode, and seamless cloud database synchronization.

🔗 **Live Demo :** [https://task-flow-gfbk.onrender.com/](https://task-flow-gfbk.onrender.com/)

---

## ✨ Key Features

### 🛡️ Strict Guest vs. Authenticated Data Isolation
- **Guest Mode (Not Logged In):**
  - **Zero Backend API Calls**: The frontend never calls Express/MongoDB endpoints (`/api/tasks`, `/api/lists`) when a user is unauthenticated.
  - **Isolated LocalStorage**: All guest tasks, custom lists, and theme preferences read and write exclusively to dedicated local keys (`taskflow_guest_tasks`, `taskflow_guest_lists`, `taskflow_guest_darkMode`).
  - **Device Isolation**: Guest data is strictly bound to the user's browser/device.
- **Authenticated Mode (Logged In):**
  - All operations sync directly with MongoDB via protected REST API routes using a JWT Bearer token in the `Authorization` header.
  - User MongoDB data is isolated per `userId` and never pollutes guest localStorage.
  - Logging out clears memory state and returns seamlessly to local guest mode.

### 🎯 Core Task Functionality
- 📌 **Create & Manage Tasks** — Add, edit, delete, and organize tasks effortlessly.
- 🧭 **Smart Filtering** — Instant filtering by Today, Upcoming, or Custom Lists.
- 📄 **Task Detail Drawer** — Comprehensive drawer to edit title, description, due date, list assignment, subtasks, and tags.
- ✅ **Subtasks Management** — Interactive subtask checklist with progress tracking, completion toggles, and deletion.
- 🏷️ **Tags System** — Add and remove custom colored tag badges (e.g. `#urgent`, `#feature`, `#bug`).
- ⭐ **Priority Stars** — Star important tasks to prioritize them across views.
- 🔍 **Live Search & Suggestions** — Real-time search by task title or tag with clickable suggestions.

### 📋 Custom List Management & Deletion
- **Initial Defaults** — Built-in `Personal` and `Work` lists.
- **Create Custom Lists** — Create unlimited custom lists with automatic color assignment.
- **Custom List Deletion** — Hover over any custom list in the sidebar to delete it.
- **Safe Task Reassignment** — Deleting a custom list automatically reassigns all its tasks to `Personal` to prevent data loss.

### 🔔 Priority Task Reminders
- **Header Alert Banner & Bell Badge** — Live alerts for Starred tasks, Urgent tagged tasks, and tasks that are Overdue or Due Today.
- **Instant Dismiss & Navigation** — Click any reminder in the alert banner to jump straight to that task.

### 🎨 Modern UX & Aesthetics
- **Dark & Light Themes** — Smooth dark mode toggle with persistent preference (synced to MongoDB when authenticated).
- **Responsive Design** — Fully responsive dashboard layout for desktop, tablet, and mobile.
- **Custom Dialogs** — Polished confirmation modals replacing default browser alerts.
- **Micro-animations** — Smooth transitions, hover effects, and interactive feedback.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4 | UI library, build system & modern styling |
| **Backend** | Node.js, Express.js | RESTful API Server |
| **Database** | MongoDB & Mongoose ORM | Cloud/Local document database |
| **Authentication** | JWT (`jsonwebtoken`), `bcryptjs` | Token authentication & password hashing |
| **Icons** | Lucide React | Modern SVG icon set |
| **Dev Tooling** | Concurrently | Single-command concurrent frontend + backend development |

---

## 🚀 Getting Started & Local Setup

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

1. **Backend Environment** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_jwt_secret_key_here
```

2. **Frontend Environment** (`.env`):
```env
VITE_API_BASE_URL=/api
```
*(During local development, Vite automatically proxies `/api` requests directly to `http://localhost:5000`)*

### 4. Install Dependencies
```bash
# Install frontend (root) dependencies
npm install

# Install backend (server) dependencies
cd server && npm install && cd ..
```

### 5. Run the Application
```bash
npm run dev
```

`concurrently` starts both the **Vite React Frontend** (`http://localhost:5173`) and the **Express Backend Server** (`http://localhost:5000`) simultaneously in a single terminal with colored output tags.

---

## 📂 Project Architecture

```
task_flow/
├── public/
│   └── todo-list-svgrepo-com.svg # Favicon
├── server/                       # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose Connection
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Bearer Token Protection Middleware
│   ├── models/
│   │   ├── User.js               # User Schema (name, email, password, darkMode)
│   │   ├── Task.js               # Task Schema (subtasks, tags, starred, list, dueDate)
│   │   └── List.js               # Custom List Schema (listId, name, color)
│   ├── routes/
│   │   ├── auth.js               # Register, Login, Me, Theme preference routes
│   │   ├── tasks.js              # Protected Task CRUD routes
│   │   └── lists.js              # Protected List CRUD & Deletion routes
│   ├── .env.example              # Server environment template
│   ├── package.json              # Server dependencies & scripts
│   └── server.js                 # Express server entry point & CORS configuration
├── src/                          # React Frontend
│   ├── components/
│   │   ├── AuthModal.jsx         # Login & Register Modal
│   │   ├── ConfirmDialog.jsx     # Custom Modal Confirmation Dialog
│   │   ├── Header.jsx            # Header with Auth, Bell & Theme toggle
│   │   ├── PriorityReminders.jsx # Priority Reminders Alert Banner
│   │   ├── Sidebar.jsx           # Sidebar navigation, search & custom list deletion
│   │   ├── TaskDetail.jsx        # Task detail drawer with subtasks & tags editor
│   │   └── TaskList.jsx          # Task list cards with metadata & quick actions
│   ├── context/
│   │   └── AppContext.jsx        # Central State Provider with isolated hooks
│   ├── hooks/
│   │   ├── useAppContext.js      # AppContext consumer hook
│   │   ├── useAuth.js            # Authentication state & JWT session management
│   │   ├── useLists.js           # List state, operations & deletion logic
│   │   ├── useLocalStorage.js    # Safe localStorage hook with error boundary
│   │   ├── useTaskFilters.js     # Filtering, search & active navigation logic
│   │   ├── useTasks.js           # Task CRUD & strict guest/auth data isolation
│   │   └── useTheme.js           # Dark mode management & API sync
│   ├── services/
│   │   └── api.js                # Centralized API service with JWT headers
│   ├── App.jsx                   # Main layout component
│   ├── index.css                 # Global CSS & Tailwind styling
│   └── main.jsx                  # React application entry point
├── .env.example                  # Frontend environment template
├── .gitignore                    # Security-hardened gitignore
├── eslint.config.js              # ESLint configuration for React & Node
├── index.html                    # HTML entry point with SEO metadata
├── package.json                  # Root dependencies & unified dev scripts
├── README.md                     # Project documentation
└── vite.config.js                # Vite configuration with /api development proxy
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Save/Add task or subtask |
| `Escape` | Cancel current action or close modal |

---

## 📄 License

This project is licensed under the **MIT License**.

## 👨‍💻 Author

**Tanush Halder**
- GitHub: [@TanushHAlder04](https://github.com/TanushHAlder04)

---

**Happy Task Managing! 🎉**
