function TodoShell({
  busy,
  draft,
  error,
  loadingTodos,
  todos,
  user,
  onCreateTodo,
  onDeleteTodo,
  onDraftChange,
  onLogout,
  onToggleTodo
}) {
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="todo-panel">
      <div className="todo-header">
        <div>
          <p className="panel-kicker">Sesion activa</p>
          <h2>{user.displayName || user.email}</h2>
          <p className="panel-copy">
            {todos.length} tareas en total, {completedCount} completadas.
          </p>
        </div>

        <button className="ghost-link danger-link" type="button" onClick={onLogout}>
          Cerrar sesion
        </button>
      </div>

      <form className="todo-form" onSubmit={onCreateTodo}>
        <input
          type="text"
          placeholder="Anota la siguiente tarea importante"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
        />
        <button className="primary-button" type="submit" disabled={busy}>
          Anadir
        </button>
      </form>

      {error ? <p className="error-banner">{error}</p> : null}

      <div className="todo-list">
        {loadingTodos ? (
          <div className="panel-message">Sincronizando tareas...</div>
        ) : todos.length === 0 ? (
          <div className="panel-message">
            Tu lista esta vacia. Crea la primera tarea para empezar.
          </div>
        ) : (
          todos.map((todo) => (
            <article
              className={`todo-card ${todo.completed ? "is-complete" : ""}`}
              key={todo._id}
            >
              <button
                className="check-button"
                type="button"
                onClick={() => onToggleTodo(todo)}
                aria-label="Cambiar estado de la tarea"
              >
                {todo.completed ? "Hecha" : "Pendiente"}
              </button>

              <div className="todo-copy">
                <strong>{todo.title}</strong>
                <span>
                  Actualizada {new Date(todo.updatedAt).toLocaleString("es-ES")}
                </span>
              </div>

              <button
                className="ghost-link"
                type="button"
                onClick={() => onDeleteTodo(todo._id)}
              >
                Eliminar
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default TodoShell;

