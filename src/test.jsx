import React, { useState, useEffect, useCallback, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setLogLevel } from 'firebase/firestore';

// Variáveis globais injetadas pelo ambiente
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Componentes de Ícones (Inline SVG) ---
const PlusIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

const Trash2Icon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const CheckCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M9 11l3 3L22 4"/></svg>
);

/**
 * Main application component for the To-Do List.
 */
const App = () => {
  // State for Firebase
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // State for To-Do application logic
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------------------------------------
  // 1. FIREBASE INITIALIZATION AND AUTHENTICATION
  // ------------------------------------------------

  useEffect(() => {
    try {
      setLogLevel('debug'); // Enable Firestore logging

      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else if (initialAuthToken) {
          // Use the custom token if available
          await signInWithCustomToken(firebaseAuth, initialAuthToken);
        } else {
          // Sign in anonymously if no token
          await signInAnonymously(firebaseAuth);
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      setError("Failed to initialize the database. Check console for details.");
    }
  }, []);

  // ------------------------------------------------
  // 2. FIRESTORE DATA LISTENER (REAL-TIME UPDATES)
  // ------------------------------------------------

  useEffect(() => {
    // Only proceed if DB is initialized and User ID is available
    if (!db || !userId) return;

    // Caminho para dados PRIVADOS do usuário: /artifacts/{appId}/users/{userId}/todos
    const collectionPath = `artifacts/${appId}/users/${userId}/todos`;
    const todosCollectionRef = collection(db, collectionPath);
    const q = query(todosCollectionRef);

    setLoading(true);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const todosList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); // Sort by creation time in memory, safely

        setTodos(todosList);
        setLoading(false);
        setError(null);
      } catch (e) {
        console.error("Error fetching todos from Firestore:", e);
        setError("Could not load tasks. Check console for database errors.");
        setLoading(false);
      }
    }, (e) => {
        console.error("Error setting up onSnapshot listener:", e);
        setError("Real-time data connection failed. Please check your network.");
        setLoading(false);
    });

    return () => unsubscribe();
  }, [db, userId]);

  // ------------------------------------------------
  // 3. CRUD OPERATIONS
  // ------------------------------------------------

  const handleAddTodo = useCallback(async (e) => {
    e.preventDefault();
    if (!newTodoText.trim() || !db || !userId) return;

    try {
      const collectionPath = `artifacts/${appId}/users/${userId}/todos`;
      await addDoc(collection(db, collectionPath), {
        text: newTodoText.trim(),
        completed: false,
        createdAt: Date.now(),
      });
      setNewTodoText('');
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Failed to add task. Please try again.");
    }
  }, [newTodoText, db, userId]);

  const handleToggleTodo = useCallback(async (id, completed) => {
    if (!db || !userId) return;

    try {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/todos`, id);
      await updateDoc(docRef, { completed: !completed });
    } catch (e) {
      console.error("Error updating document: ", e);
      setError("Failed to update task status. Please try again.");
    }
  }, [db, userId]);

  const handleDeleteTodo = useCallback(async (id) => {
    if (!db || !userId) return;

    try {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/todos`, id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Error deleting document: ", e);
      setError("Failed to delete task. Please try again.");
    }
  }, [db, userId]);

  // ------------------------------------------------
  // 4. UI COMPONENTS
  // ------------------------------------------------

  const TodoItem = ({ todo }) => (
    <div
      className={`flex items-center justify-between p-4 mb-3 border-b-2 transition duration-300 rounded-lg shadow-sm ${
        todo.completed
          ? 'bg-emerald-50 border-emerald-300 text-gray-500 line-through'
          : 'bg-white border-blue-500 hover:shadow-md'
      }`}
    >
      <div className="flex items-center flex-1 min-w-0 cursor-pointer" onClick={() => handleToggleTodo(todo.id, todo.completed)}>
        <button
          className={`w-6 h-6 mr-4 flex items-center justify-center rounded-full border-2 transition duration-200 ${
            todo.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-blue-500 text-transparent hover:bg-blue-100'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && <CheckCircleIcon className="w-4 h-4" />}
        </button>
        <span className="text-lg truncate">{todo.text}</span>
      </div>
      <button
        onClick={() => handleDeleteTodo(todo.id)}
        className="ml-4 p-2 text-red-500 hover:bg-red-100 rounded-full transition duration-150"
        aria-label="Delete task"
      >
        <Trash2Icon className="w-5 h-5" />
      </button>
    </div>
  );

  // ------------------------------------------------
  // 5. MAIN RENDER LOGIC
  // ------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight mb-2">
            FireList
          </h1>
          <p className="text-gray-500 text-lg">
            Your Real-Time React To-Do List
          </p>
          <div className="mt-4 p-2 text-sm bg-blue-100 text-blue-800 rounded-lg shadow-inner break-words">
            **Your User ID:** <span className="font-mono font-semibold">{userId || 'Loading...'}</span>
          </div>
        </header>

        {/* New Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-8 p-4 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
          <div className="flex space-x-3">
            <input
              type="text"
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 text-gray-800"
              placeholder="What needs to be done?"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              disabled={!isAuthReady || loading}
              aria-label="New task input"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
              disabled={!newTodoText.trim() || !isAuthReady || loading}
              aria-label="Add task"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              Add
            </button>
          </div>
        </form>

        {/* Loading and Error States */}
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 border-l-4 border-red-500 rounded-md shadow-sm">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-blue-600">Loading tasks...</p>
          </div>
        )}

        {/* To-Do List */}
        {!loading && todos.length === 0 && (
          <div className="p-10 text-center bg-white rounded-xl shadow-lg text-gray-500">
            <h2 className="text-xl font-semibold mb-2">All Clear! 🎉</h2>
            <p>You have no tasks. Add one above to get started.</p>
          </div>
        )}

        <div className="space-y-3">
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>

        {/* Summary Footer */}
        {todos.length > 0 && (
          <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>
              {todos.filter(t => t.completed).length} completed out of {todos.length} tasks.
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};

// Lógica de montagem
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
