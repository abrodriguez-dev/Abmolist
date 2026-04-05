import { useEffect, useState } from "react";
import {
  loginWithGoogle,
  logout,
  onAuthChanged,
  loginWithEmail,
  registerWithEmail
} from "./lib/firebase";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./lib/api";
import AuthPanel from "./components/AuthPanel";
import TodoShell from "./components/TodoShell";

const initialForm = {
  email: "",
  password: ""
};

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [credentials, setCredentials] = useState(initialForm);
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [draft, setDraft] = useState("");
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
      setError(requestError.message);
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
      setError(requestError.message);
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
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleCreateTodo = async (event) => {
    event.preventDefault();

    if (!draft.trim() || !user) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const newTodo = await createTodo(user, draft.trim());
      setTodos((current) => [newTodo, ...current]);
      setDraft("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleToggleTodo = async (todo) => {
    if (!user) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const updated = await updateTodo(user, todo._id, {
        completed: !todo.completed
      });

      setTodos((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );
    } catch (requestError) {
      setError(requestError.message);
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

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Abmolist</p>
          <h1>Tu lista de tareas, protegida por sesion y lista para crecer.</h1>
          <p className="lead">
            React y Vite en el cliente, Firebase para autenticar, Express para
            validar tokens y MongoDB Atlas para guardar cada tarea por usuario.
          </p>
          <div className="status-grid">
            <article>
              <span>Frontend</span>
              <strong>React + Vite</strong>
            </article>
            <article>
              <span>Auth</span>
              <strong>Firebase</strong>
            </article>
            <article>
              <span>Data</span>
              <strong>MongoDB Atlas</strong>
            </article>
          </div>
        </div>

        <div className="hero-panel">
          {authLoading ? (
            <div className="panel-message">Cargando sesion...</div>
          ) : user ? (
            <TodoShell
              busy={busy}
              draft={draft}
              error={error}
              loadingTodos={loadingTodos}
              todos={todos}
              user={user}
              onCreateTodo={handleCreateTodo}
              onDeleteTodo={handleDeleteTodo}
              onDraftChange={setDraft}
              onLogout={handleLogout}
              onToggleTodo={handleToggleTodo}
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

