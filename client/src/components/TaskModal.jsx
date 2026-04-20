const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" }
];

function TaskModal({
  busy,
  form,
  isEditing,
  isOpen,
  onChange,
  onClose,
  onSubmit
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="task-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="task-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar formulario"
        >
          ×
        </button>

        <div className="task-modal-header">
          <p className="panel-kicker">{isEditing ? "Edit task" : "Create task"}</p>
          <h3 id="task-modal-title">
            {isEditing ? "Edit task" : "Add a new task"}
          </h3>
          <p className="panel-copy">
            {isEditing
              ? "Actualiza la informacion principal y guarda los cambios de la tarjeta."
              : "Completa la informacion principal y elige el estado inicial de la tarjeta."}
          </p>
        </div>

        <form
          className="task-modal-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="task-modal-field task-modal-field--full">
            <span>Task title</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Escribe el titulo de la tarea"
              required
            />
          </label>

          <label className="task-modal-field">
            <span>Due date</span>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={onChange}
            />
          </label>

          <label className="task-modal-field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={onChange}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="task-modal-field task-modal-field--full">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Describe el objetivo, el contexto o los siguientes pasos"
              rows={7}
            />
          </label>

          <div className="task-modal-actions">
            <button
              className="secondary-button task-modal-button"
              type="button"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              className="primary-button task-modal-button"
              type="submit"
              disabled={busy}
            >
              {busy ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
