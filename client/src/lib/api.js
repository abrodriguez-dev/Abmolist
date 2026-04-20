const apiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:4000/api" : "/api");

async function request(user, path, options = {}) {
  const token = await user.getIdToken();
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "No se pudo completar la solicitud.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const fetchTodos = (user) => request(user, "/todos");

export const createTodo = (user, payload) =>
  request(user, "/todos", {
    method: "POST",
    body: JSON.stringify(
      typeof payload === "string" ? { title: payload } : payload
    )
  });

export const updateTodo = (user, todoId, payload) =>
  request(user, `/todos/${todoId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

export const deleteTodo = (user, todoId) =>
  request(user, `/todos/${todoId}`, {
    method: "DELETE"
  });
