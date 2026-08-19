const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to perform fetch requests with JWT authorization header.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong with the server request');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Make sure the Node.js server is running on http://localhost:5000.');
    }
    throw error;
  }
}

export const api = {
  // Auth
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request('/auth/me'),

  updateTheme: (darkMode) =>
    request('/auth/theme', {
      method: 'PUT',
      body: JSON.stringify({ darkMode }),
    }),

  // Tasks
  getTasks: () => request('/tasks'),

  createTask: (title, list, dueDate) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, list, dueDate }),
    }),

  updateTask: (id, updates) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  // Lists
  getLists: () => request('/lists'),

  createList: (name, color) =>
    request('/lists', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    }),

  deleteList: (listId) =>
    request(`/lists/${listId}`, {
      method: 'DELETE',
    }),
};
