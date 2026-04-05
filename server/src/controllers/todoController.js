import Todo from "../models/Todo.js";

export async function getTodos(request, response) {
  const todos = await Todo.find({ userId: request.user.uid }).sort({
    createdAt: -1
  });

  response.json(todos);
}

export async function createTodo(request, response) {
  const title = request.body?.title?.trim();

  if (!title) {
    return response.status(400).json({
      message: "El titulo de la tarea es obligatorio."
    });
  }

  const todo = await Todo.create({
    title,
    userId: request.user.uid
  });

  return response.status(201).json(todo);
}

export async function updateTodo(request, response) {
  const { id } = request.params;
  const updates = {};

  if (typeof request.body.title === "string") {
    const title = request.body.title.trim();

    if (!title) {
      return response.status(400).json({
        message: "El titulo no puede quedar vacio."
      });
    }

    updates.title = title;
  }

  if (typeof request.body.completed === "boolean") {
    updates.completed = request.body.completed;
  }

  const todo = await Todo.findOneAndUpdate(
    {
      _id: id,
      userId: request.user.uid
    },
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!todo) {
    return response.status(404).json({
      message: "No se encontro la tarea."
    });
  }

  return response.json(todo);
}

export async function deleteTodo(request, response) {
  const { id } = request.params;

  const deletedTodo = await Todo.findOneAndDelete({
    _id: id,
    userId: request.user.uid
  });

  if (!deletedTodo) {
    return response.status(404).json({
      message: "No se encontro la tarea."
    });
  }

  return response.status(204).send();
}

