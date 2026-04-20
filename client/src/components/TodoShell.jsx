import { useEffect, useMemo, useRef, useState } from "react";
import TaskModal from "./TaskModal";

const STATUS_ORDER = ["todo", "in_progress", "completed"];
const MOBILE_LONG_PRESS_MS = 420;
const BRAND_LOGO_SRC = "/abmorocha-logo.png";

const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    chip: "task-badge task-badge--todo"
  },
  in_progress: {
    label: "In Progress",
    chip: "task-badge task-badge--progress"
  },
  completed: {
    label: "Completed",
    chip: "task-badge task-badge--completed"
  }
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="theme-toggle-icon theme-toggle-icon--sun">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99998 1.5415C10.4142 1.5415 10.75 1.87729 10.75 2.2915V3.5415C10.75 3.95572 10.4142 4.2915 9.99998 4.2915C9.58577 4.2915 9.24998 3.95572 9.24998 3.5415V2.2915C9.24998 1.87729 9.58577 1.5415 9.99998 1.5415ZM10.0009 6.79327C8.22978 6.79327 6.79402 8.22904 6.79402 10.0001C6.79402 11.7712 8.22978 13.207 10.0009 13.207C11.772 13.207 13.2078 11.7712 13.2078 10.0001C13.2078 8.22904 11.772 6.79327 10.0009 6.79327ZM5.29402 10.0001C5.29402 7.40061 7.40135 5.29327 10.0009 5.29327C12.6004 5.29327 14.7078 7.40061 14.7078 10.0001C14.7078 12.5997 12.6004 14.707 10.0009 14.707C7.40135 14.707 5.29402 12.5997 5.29402 10.0001ZM15.9813 5.08035C16.2742 4.78746 16.2742 4.31258 15.9813 4.01969C15.6884 3.7268 15.2135 3.7268 14.9207 4.01969L14.0368 4.90357C13.7439 5.19647 13.7439 5.67134 14.0368 5.96423C14.3297 6.25713 14.8045 6.25713 15.0974 5.96423L15.9813 5.08035ZM18.4577 10.0001C18.4577 10.4143 18.1219 10.7501 17.7077 10.7501H16.4577C16.0435 10.7501 15.7077 10.4143 15.7077 10.0001C15.7077 9.58592 16.0435 9.25013 16.4577 9.25013H17.7077C18.1219 9.25013 18.4577 9.58592 18.4577 10.0001ZM14.9207 15.9806C15.2135 16.2735 15.6884 16.2735 15.9813 15.9806C16.2742 15.6877 16.2742 15.2128 15.9813 14.9199L15.0974 14.036C14.8045 13.7431 14.3297 13.7431 14.0368 14.036C13.7439 14.3289 13.7439 14.8038 14.0368 15.0967L14.9207 15.9806ZM9.99998 15.7088C10.4142 15.7088 10.75 16.0445 10.75 16.4588V17.7088C10.75 18.123 10.4142 18.4588 9.99998 18.4588C9.58577 18.4588 9.24998 18.123 9.24998 17.7088V16.4588C9.24998 16.0445 9.58577 15.7088 9.99998 15.7088ZM5.96356 15.0972C6.25646 14.8043 6.25646 14.3295 5.96356 14.0366C5.67067 13.7437 5.1958 13.7437 4.9029 14.0366L4.01902 14.9204C3.72613 15.2133 3.72613 15.6882 4.01902 15.9811C4.31191 16.274 4.78679 16.274 5.07968 15.9811L5.96356 15.0972ZM4.29224 10.0001C4.29224 10.4143 3.95645 10.7501 3.54224 10.7501H2.29224C1.87802 10.7501 1.54224 10.4143 1.54224 10.0001C1.54224 9.58592 1.87802 9.25013 2.29224 9.25013H3.54224C3.95645 9.25013 4.29224 9.58592 4.29224 10.0001ZM4.9029 5.9637C5.1958 6.25659 5.67067 6.25659 5.96356 5.9637C6.25646 5.6708 6.25646 5.19593 5.96356 4.90303L5.07968 4.01915C4.78679 3.72626 4.31191 3.72626 4.01902 4.01915C3.72613 4.31204 3.72613 4.78692 4.01902 5.07981L4.9029 5.9637Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4 9h16" />
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="18" cy="12" r="1.8" />
    </svg>
  );
}

function TaskMenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.75586 5.50098C7.75586 5.08676 8.09165 4.75098 8.50586 4.75098H18.4985C18.9127 4.75098 19.2485 5.08676 19.2485 5.50098L19.2485 15.4956C19.2485 15.9098 18.9127 16.2456 18.4985 16.2456H8.50586C8.09165 16.2456 7.75586 15.9098 7.75586 15.4956V5.50098ZM8.50586 3.25098C7.26322 3.25098 6.25586 4.25834 6.25586 5.50098V6.26318H5.50195C4.25931 6.26318 3.25195 7.27054 3.25195 8.51318V18.4995C3.25195 19.7422 4.25931 20.7495 5.50195 20.7495H15.4883C16.7309 20.7495 17.7383 19.7421 17.7383 18.4995L17.7383 17.7456H18.4985C19.7411 17.7456 20.7485 16.7382 20.7485 15.4956L20.7485 5.50097C20.7485 4.25833 19.7411 3.25098 18.4985 3.25098H8.50586ZM16.2383 17.7456H8.50586C7.26322 17.7456 6.25586 16.7382 6.25586 15.4956V7.76318H5.50195C5.08774 7.76318 4.75195 8.09897 4.75195 8.51318V18.4995C4.75195 18.9137 5.08774 19.2495 5.50195 19.2495H15.4883C15.9025 19.2495 16.2383 18.9137 16.2383 18.4995L16.2383 17.7456Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={open ? "is-open" : ""}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 17v2a2 2 0 0 0 2 2h6" />
      <path d="M14 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
      <path d="M20 12H9" />
      <path d="m16 8 4 4-4 4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
      />
    </svg>
  );
}

function BrandLogo({ className = "" }) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt="Abmorocha logo"
      className={`dashboard-brand-logo ${className}`.trim()}
    />
  );
}

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function getUserName(user) {
  return user.displayName || user.email || "Workspace";
}

function getUserInitials(user) {
  return getUserName(user)
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");
}

function normalizeStatus(todo) {
  if (STATUS_CONFIG[todo.status]) {
    return todo.status;
  }

  return todo.completed ? "completed" : "todo";
}

function getIsMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth <= 1180;
}

function TaskCard({
  isMobileMoveActive,
  isMobileViewport,
  isSelectedForMobileMove,
  onEditTodo,
  isDragging,
  onDeleteTodo,
  onDragStart,
  onDragEnd,
  onSelectForMobileMove,
  todo,
  user
}) {
  const status = normalizeStatus(todo);
  const hasDescription = Boolean(todo.description?.trim());
  const longPressTimerRef = useRef(null);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  useEffect(() => () => clearLongPressTimer(), []);

  const startMobileLongPress = () => {
    if (!isMobileViewport) {
      return;
    }

    clearLongPressTimer();
    longPressTimerRef.current = window.setTimeout(() => {
      onSelectForMobileMove(todo._id);
      longPressTimerRef.current = null;
    }, MOBILE_LONG_PRESS_MS);
  };

  return (
    <article
      className={`kanban-card ${isDragging ? "kanban-card--dragging" : ""} ${
        isSelectedForMobileMove ? "kanban-card--mobile-selected" : ""
      }`}
      draggable={!isMobileViewport}
      onDragStart={() => onDragStart(todo._id)}
      onDragEnd={onDragEnd}
      onTouchStart={startMobileLongPress}
      onTouchEnd={clearLongPressTimer}
      onTouchMove={clearLongPressTimer}
      onTouchCancel={clearLongPressTimer}
    >
      <div className="kanban-card-top">
        <button
          className="kanban-card-edit"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEditTodo(todo);
          }}
          aria-label="Editar tarea"
        >
          <EditIcon />
          <span>Edit</span>
        </button>

        <div className="kanban-card-copy">
          <h4>{todo.title}</h4>
          {hasDescription ? <p>{todo.description}</p> : null}
        </div>

        <div className="kanban-avatar" aria-hidden="true">
          {getUserInitials(user)}
        </div>
      </div>

      <div className="kanban-card-meta">
        <span className={STATUS_CONFIG[status].chip}>{STATUS_CONFIG[status].label}</span>
        <span className="kanban-card-date">
          <CalendarIcon />
          {formatDate(todo.dueDate || todo.updatedAt)}
        </span>
      </div>

      <div className="kanban-card-actions">
        <span className="kanban-card-updated">
          Actualizada {new Date(todo.updatedAt).toLocaleDateString("es-ES")}
        </span>
        <button
          className="kanban-card-delete"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteTodo(todo._id);
          }}
        >
          Eliminar
        </button>
      </div>

      {isMobileMoveActive && isSelectedForMobileMove ? (
        <div className="kanban-card-mobile-hint">
          Toca otra columna para mover esta tarea.
        </div>
      ) : null}
    </article>
  );
}

function KanbanColumn({
  activeDropStatus,
  draggingTodoId,
  isMobileMoveActive,
  isMobileViewport,
  mobileMoveTargetId,
  items,
  onEditTodo,
  onDeleteTodo,
  onDragEnd,
  onDragEnterColumn,
  onDragLeaveColumn,
  onDragStart,
  onDropInColumn,
  onMoveTodoToColumn,
  onSelectForMobileMove,
  status,
  user
}) {
  const isDropTarget = activeDropStatus === status;
  const currentMobileTodo = items.find((todo) => todo._id === mobileMoveTargetId);
  const isCurrentColumnOfSelectedTodo = Boolean(currentMobileTodo);
  const canReceiveMobileMove = isMobileMoveActive && !isCurrentColumnOfSelectedTodo;

  return (
    <section
      className={`kanban-column ${isDropTarget ? "kanban-column--active" : ""} ${
        canReceiveMobileMove ? "kanban-column--mobile-target" : ""
      }`}
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={() => onDragEnterColumn(status)}
      onDragLeave={() => onDragLeaveColumn(status)}
      onDrop={() => onDropInColumn(status)}
      onClick={() => {
        if (canReceiveMobileMove) {
          onMoveTodoToColumn(status);
        }
      }}
    >
      <div className="kanban-column-head">
        <div className="kanban-column-title">
          <h3>{STATUS_CONFIG[status].label}</h3>
          <span>{items.length}</span>
        </div>
        <button className="kanban-column-menu" type="button" aria-label="Opciones de columna">
          <DotsIcon />
        </button>
      </div>

      <div className="kanban-column-list">
        {canReceiveMobileMove ? (
          <button
            className="kanban-mobile-dropzone"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMoveTodoToColumn(status);
            }}
          >
            Mover aqui
          </button>
        ) : null}

        {items.length === 0 ? (
          <div className="kanban-empty-state">
            {canReceiveMobileMove
              ? `Suelta esta tarea en ${STATUS_CONFIG[status].label} tocando esta columna.`
              : `Arrastra una tarea aqui para moverla a ${STATUS_CONFIG[status].label}.`}
          </div>
        ) : (
          items.map((todo) => (
            <TaskCard
              key={todo._id}
              isDragging={draggingTodoId === todo._id}
              isMobileMoveActive={isMobileMoveActive}
              isMobileViewport={isMobileViewport}
              isSelectedForMobileMove={mobileMoveTargetId === todo._id}
              onEditTodo={onEditTodo}
              onDeleteTodo={onDeleteTodo}
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
              onSelectForMobileMove={onSelectForMobileMove}
              todo={todo}
              user={user}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TodoShell({
  busy,
  error,
  isEditingTask,
  isTaskModalOpen,
  loadingTodos,
  taskForm,
  theme,
  todos,
  user,
  onCloseTaskModal,
  onEditTodo,
  onDeleteTodo,
  onOpenTaskModal,
  onLogout,
  onStatusChange,
  onSubmitTask,
  onTaskFormChange,
  onToggleTheme
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [draggingTodoId, setDraggingTodoId] = useState(null);
  const [activeDropStatus, setActiveDropStatus] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(true);
  const [sidebarPage, setSidebarPage] = useState("taskKanban");
  const [isSidebarPinnedOpen, setIsSidebarPinnedOpen] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [mobileMoveTodoId, setMobileMoveTodoId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobileViewport();

      setIsMobileViewport(mobile);

      if (!mobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileViewport) {
      setMobileMoveTodoId(null);
    }
  }, [isMobileViewport]);

  const isSidebarExpanded = isMobileViewport
    ? isMobileSidebarOpen
    : isSidebarPinnedOpen || isSidebarHovered;

  const filteredTodos = useMemo(() => {
    const searchTerms = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return todos
      .filter((todo) => {
        const status = normalizeStatus(todo);

        if (activeFilter !== "all" && status !== activeFilter) {
          return false;
        }

        if (searchTerms.length === 0) {
          return true;
        }

        const haystack = `${todo.title} ${todo.description || ""}`.toLowerCase();

        return searchTerms.every((term) => haystack.includes(term));
      })
      .sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      );
  }, [activeFilter, query, todos]);

  const groupedTodos = useMemo(
    () =>
      STATUS_ORDER.reduce(
        (groups, status) => ({
          ...groups,
          [status]: filteredTodos.filter((todo) => normalizeStatus(todo) === status)
        }),
        {}
      ),
    [filteredTodos]
  );

  const counts = useMemo(
    () => ({
      all: todos.length,
      todo: todos.filter((todo) => normalizeStatus(todo) === "todo").length,
      in_progress: todos.filter((todo) => normalizeStatus(todo) === "in_progress")
        .length,
      completed: todos.filter((todo) => normalizeStatus(todo) === "completed").length
    }),
    [todos]
  );

  const hasSearchTerms = query.trim().length > 0;
  const hasVisibleTodos = filteredTodos.length > 0;

  const handleDropInColumn = async (status) => {
    if (!draggingTodoId) {
      return;
    }

    setActiveDropStatus(null);
    const currentTodo = todos.find((todo) => todo._id === draggingTodoId);

    if (!currentTodo || normalizeStatus(currentTodo) === status) {
      setDraggingTodoId(null);
      return;
    }

    await onStatusChange(draggingTodoId, status);
    setDraggingTodoId(null);
  };

  const handleMobileMove = async (status) => {
    if (!mobileMoveTodoId) {
      return;
    }

    const currentTodo = todos.find((todo) => todo._id === mobileMoveTodoId);

    if (!currentTodo) {
      setMobileMoveTodoId(null);
      return;
    }

    if (normalizeStatus(currentTodo) === status) {
      setMobileMoveTodoId(null);
      return;
    }

    await onStatusChange(mobileMoveTodoId, status);
    setMobileMoveTodoId(null);
  };

  return (
    <>
      <div
        className={`dashboard-layout ${
          isMobileViewport
            ? "dashboard-layout--mobile"
            : isSidebarExpanded
              ? "dashboard-layout--sidebar-open"
              : "dashboard-layout--sidebar-collapsed"
        }`}
      >
        {isMobileViewport && isMobileSidebarOpen ? (
          <button
            className="dashboard-mobile-overlay"
            type="button"
            aria-label="Cerrar menu lateral"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={`dashboard-sidebar ${
            isMobileViewport
              ? isMobileSidebarOpen
                ? "dashboard-sidebar--mobile-open"
                : "dashboard-sidebar--mobile-closed"
              : isSidebarExpanded
                ? "dashboard-sidebar--expanded"
                : "dashboard-sidebar--collapsed"
          }`}
          onMouseEnter={() => {
            if (!isMobileViewport && !isSidebarPinnedOpen) {
              setIsSidebarHovered(true);
            }
          }}
          onMouseLeave={() => {
            if (!isMobileViewport && !isSidebarPinnedOpen) {
              setIsSidebarHovered(false);
            }
          }}
        >
          <div className="dashboard-brand">
            <div className="dashboard-brand-mark">
              <BrandLogo />
            </div>
            <div className="dashboard-brand-copy">
              <strong>AbmoList</strong>
              <span>Dashboard</span>
            </div>
          </div>

          <div className="dashboard-sidebar-section">
            <p>MENU</p>
            <nav className="dashboard-nav" aria-label="Sidebar">
              <ul className="dashboard-nav-list">
                <li className="dashboard-nav-group">
                  <button
                    type="button"
                    className={`dashboard-nav-parent ${
                      isTaskMenuOpen || sidebarPage === "taskKanban"
                        ? "is-active"
                        : ""
                    }`}
                    onClick={() => setIsTaskMenuOpen((current) => !current)}
                    aria-expanded={isTaskMenuOpen}
                  >
                    <span className="dashboard-nav-parent-main">
                      <TaskMenuIcon />
                      <span className="dashboard-nav-label">Task</span>
                    </span>
                    <ChevronIcon open={isTaskMenuOpen && isSidebarExpanded} />
                  </button>

                  <div
                    className={
                      isTaskMenuOpen && isSidebarExpanded
                        ? "dashboard-subnav"
                        : "dashboard-subnav is-hidden"
                    }
                  >
                    <ul className="dashboard-subnav-list">
                      <li>
                        <button
                          type="button"
                          className={`dashboard-subnav-item ${
                            sidebarPage === "taskKanban" ? "is-active" : ""
                          }`}
                          onClick={() => {
                            setSidebarPage("taskKanban");

                            if (isMobileViewport) {
                              setIsMobileSidebarOpen(false);
                            }
                          }}
                        >
                          Kanban
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-topbar">
            <div className="dashboard-topbar-left">
              <button
                className="icon-button"
                type="button"
                aria-label={
                  isMobileViewport
                    ? isMobileSidebarOpen
                      ? "Cerrar menu lateral"
                      : "Abrir menu lateral"
                    : isSidebarPinnedOpen
                      ? "Minimizar menu lateral"
                      : "Expandir menu lateral"
                }
                onClick={() => {
                  if (isMobileViewport) {
                    setIsMobileSidebarOpen((current) => !current);
                  } else {
                    if (isSidebarPinnedOpen) {
                      setIsSidebarPinnedOpen(false);
                      setIsSidebarHovered(false);
                    } else {
                      setIsSidebarPinnedOpen(true);
                      setIsSidebarHovered(false);
                    }
                  }
                }}
              >
                <MenuIcon />
              </button>
              <label className="dashboard-search">
                <SearchIcon />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search task title or description..."
                />
              </label>
            </div>

            <div className="dashboard-topbar-mobile-brand">
              <div className="dashboard-brand-mark">
                <BrandLogo />
              </div>
              <strong>AbmoList</strong>
            </div>

            <div className="dashboard-topbar-right">
              <button
                className="icon-button"
                type="button"
                aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
                onClick={onToggleTheme}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>

              <div className="dashboard-profile">
                <button
                  className="dashboard-user-pill"
                  type="button"
                  onClick={() => setIsProfileMenuOpen((current) => !current)}
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="menu"
                >
                  <div className="kanban-avatar">{getUserInitials(user)}</div>
                  <span>{getUserName(user)}</span>
                  <ChevronIcon open={isProfileMenuOpen} />
                </button>

                {isProfileMenuOpen ? (
                  <div className="dashboard-profile-menu" role="menu">
                    <div className="dashboard-profile-menu-head">
                      <strong>{getUserName(user)}</strong>
                      <span>{user.email}</span>
                    </div>

                    <button
                      className="dashboard-profile-menu-item"
                      type="button"
                      role="menuitem"
                      onClick={onLogout}
                    >
                      <SignOutIcon />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="dashboard-topbar-mobile-actions">
              <button className="icon-button" type="button" aria-label="Mas opciones">
                <MoreIcon />
              </button>
            </div>
          </header>

          <div className="dashboard-content">
            <div className="dashboard-content-head">
              <div className="dashboard-content-head-main">
                <p>Organiza tus tareas moviendolas entre columnas.</p>
              </div>
            </div>

            <section className="kanban-shell">
              <div className="kanban-toolbar">
                <div className="kanban-filters">
                  <button
                    type="button"
                    className={activeFilter === "all" ? "is-active" : ""}
                    onClick={() => setActiveFilter("all")}
                  >
                    All Tasks
                    <span>{counts.all}</span>
                  </button>
                  <button
                    type="button"
                    className={activeFilter === "todo" ? "is-active" : ""}
                    onClick={() => setActiveFilter("todo")}
                  >
                    To Do
                    <span>{counts.todo}</span>
                  </button>
                  <button
                    type="button"
                    className={activeFilter === "in_progress" ? "is-active" : ""}
                    onClick={() => setActiveFilter("in_progress")}
                  >
                    In Progress
                    <span>{counts.in_progress}</span>
                  </button>
                  <button
                    type="button"
                    className={activeFilter === "completed" ? "is-active" : ""}
                    onClick={() => setActiveFilter("completed")}
                  >
                    Completed
                    <span>{counts.completed}</span>
                  </button>
                </div>

                <button className="kanban-add-button" type="button" onClick={onOpenTaskModal}>
                  Add New Task
                  <PlusIcon />
                </button>
              </div>

              {error ? <p className="error-banner">{error}</p> : null}

              {loadingTodos ? (
                <div className="panel-message">Sincronizando tareas...</div>
              ) : !hasVisibleTodos && hasSearchTerms ? (
                <div className="kanban-empty-search">
                  No se encontraron tareas para la busqueda &quot;{query.trim()}&quot;.
                </div>
              ) : (
                <div className="kanban-board">
                  {STATUS_ORDER.map((status) => (
                    <KanbanColumn
                      key={status}
                      activeDropStatus={activeDropStatus}
                      draggingTodoId={draggingTodoId}
                      isMobileMoveActive={isMobileViewport && Boolean(mobileMoveTodoId)}
                      isMobileViewport={isMobileViewport}
                      mobileMoveTargetId={mobileMoveTodoId}
                      items={groupedTodos[status]}
                      onEditTodo={onEditTodo}
                      onDeleteTodo={onDeleteTodo}
                      onDragEnd={() => {
                        setDraggingTodoId(null);
                        setActiveDropStatus(null);
                      }}
                      onDragEnterColumn={setActiveDropStatus}
                      onDragLeaveColumn={(currentStatus) => {
                        if (activeDropStatus === currentStatus) {
                          setActiveDropStatus(null);
                        }
                      }}
                      onMoveTodoToColumn={handleMobileMove}
                      onSelectForMobileMove={setMobileMoveTodoId}
                      onDragStart={setDraggingTodoId}
                      onDropInColumn={handleDropInColumn}
                      status={status}
                      user={user}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>

      <TaskModal
        busy={busy}
        form={taskForm}
        isEditing={isEditingTask}
        isOpen={isTaskModalOpen}
        onChange={onTaskFormChange}
        onClose={onCloseTaskModal}
        onSubmit={onSubmitTask}
      />
    </>
  );
}

export default TodoShell;
