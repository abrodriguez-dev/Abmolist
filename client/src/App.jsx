import { useEffect, useState } from "react";
import {
  getFirebaseErrorMessage,
  isFirebaseConfigured,
  loginWithGoogle,
  logout,
  missingFirebaseEnvKeys,
  onAuthChanged,
  loginWithEmail,
  registerWithEmail
} from "./lib/firebase";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./lib/api";
import AuthPanel from "./components/AuthPanel";
import SetupChecklist from "./components/SetupChecklist";
import TodoShell from "./components/TodoShell";

const initialForm = {
  email: "",
  password: ""
};

const initialTaskForm = {
  title: "",
  description: "",
  status: "todo",
  dueDate: ""
};

function toTaskForm(todo) {
  return {
    title: todo.title || "",
    description: todo.description || "",
    status: todo.status || (todo.completed ? "completed" : "todo"),
    dueDate: todo.dueDate ? String(todo.dueDate).slice(0, 10) : ""
  };
}

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.localStorage.getItem("abmolist-theme") || "light";
}

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [credentials, setCredentials] = useState(initialForm);
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthChanged(async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      setError("");

      if (!currentUser) {
        setTodos([]);
        return;
      }

      try {
        setLoadingTodos(true);
        const items = await fetchTodos(currentUser);
        setTodos(items);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoadingTodos(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    document.body.classList.toggle("theme-dark", theme === "dark");
    document.body.dataset.theme = theme;
    window.localStorage.setItem("abmolist-theme", theme);
  }, [theme]);

  const handleCredentialChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (authMode === "register") {
        await registerWithEmail(credentials.email, credentials.password);
      } else {
        await loginWithEmail(credentials.email, credentials.password);
      }

      setCredentials(initialForm);
    } catch (requestError) {
      setError(getFirebaseErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setBusy(true);
    setError("");

    try {
      await loginWithGoogle();
    } catch (requestError) {
      setError(getFirebaseErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    setError("");

    try {
      await logout();
    } catch (requestError) {
      setError(getFirebaseErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleOpenTaskModal = () => {
    setEditingTaskId(null);
    setTaskForm(initialTaskForm);
    setError("");
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (todo) => {
    setEditingTaskId(todo._id);
    setTaskForm(toTaskForm(todo));
    setError("");
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    if (busy) {
      return;
    }

    setEditingTaskId(null);
    setIsTaskModalOpen(false);
    setTaskForm(initialTaskForm);
  };

  const handleSubmitTask = async () => {
    if (!taskForm.title.trim() || !user) {
      return null;
    }

    setBusy(true);
    setError("");

    try {
      const payload = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        status: taskForm.status,
        dueDate: taskForm.dueDate || null
      };

      if (editingTaskId) {
        const updatedTodo = await updateTodo(user, editingTaskId, payload);

        setTodos((current) =>
          current.map((item) => (item._id === updatedTodo._id ? updatedTodo : item))
        );
      } else {
        const newTodo = await createTodo(user, payload);
        setTodos((current) => [newTodo, ...current]);
      }

      setEditingTaskId(null);
      setTaskForm(initialTaskForm);
      setIsTaskModalOpen(false);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return null;
    } finally {
      setBusy(false);
    }
  };

  const handleStatusChange = async (todoId, status) => {
    if (!user) {
      return null;
    }

    const previousTodos = todos;
    const optimisticTodos = todos.map((item) =>
      item._id === todoId
        ? {
            ...item,
            status,
            completed: status === "completed"
          }
        : item
    );

    setTodos(optimisticTodos);
    setBusy(true);
    setError("");

    try {
      const updated = await updateTodo(user, todoId, {
        status
      });

      setTodos((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );
      return updated;
    } catch (requestError) {
      setTodos(previousTodos);
      setError(requestError.message);
      return null;
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!user) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      await deleteTodo(user, todoId);
      setTodos((current) => current.filter((item) => item._id !== todoId));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleToggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <main className={`page-shell ${user ? "page-shell--dashboard" : ""}`}>
      <section className={`hero-card ${user ? "hero-card--dashboard" : ""}`}>
        <div className={`hero-panel ${user ? "hero-panel--dashboard" : ""}`}>
          {authLoading ? (
            <div className="panel-message">Cargando sesion...</div>
          ) : !isFirebaseConfigured ? (
            <SetupChecklist missingFirebaseEnvKeys={missingFirebaseEnvKeys} />
          ) : user ? (
            <TodoShell
              busy={busy}
              error={error}
              isEditingTask={Boolean(editingTaskId)}
              isTaskModalOpen={isTaskModalOpen}
              loadingTodos={loadingTodos}
              taskForm={taskForm}
              theme={theme}
              todos={todos}
              user={user}
              onEditTodo={handleOpenEditTaskModal}
              onCloseTaskModal={handleCloseTaskModal}
              onDeleteTodo={handleDeleteTodo}
              onOpenTaskModal={handleOpenTaskModal}
              onLogout={handleLogout}
              onStatusChange={handleStatusChange}
              onSubmitTask={handleSubmitTask}
              onTaskFormChange={handleTaskFormChange}
              onToggleTheme={handleToggleTheme}
            />
          ) : (
            <AuthPanel
              authMode={authMode}
              busy={busy}
              credentials={credentials}
              error={error}
              onChange={handleCredentialChange}
              onGoogleLogin={handleGoogleLogin}
              onSubmit={handleAuthSubmit}
              onToggleMode={setAuthMode}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
