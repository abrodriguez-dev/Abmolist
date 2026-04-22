import Todo, { TASK_STATUSES } from "../models/Todo.js";
import UserOnboarding from "../models/UserOnboarding.js";
import { buildSampleTodos } from "../lib/sampleTodos.js";

function getNormalizedStatus(todoLike) {
  if (TASK_STATUSES.includes(todoLike.status)) {
    return todoLike.status;
  }

  return todoLike.completed ? "completed" : "todo";
}

function serializeTodo(todoDocument) {
  const todo = todoDocument.toObject
    ? todoDocument.toObject()
    : { ...todoDocument };
  const status = getNormalizedStatus(todo);

  return {
    ...todo,
    status,
    description: todo.description || "",
    dueDate: todo.dueDate || null,
    completed: status === "completed"
  };
}

function parseStatus(status) {
  if (typeof status !== "string") {
    return null;
  }

  const normalizedStatus = status.trim().toLowerCase();

  return TASK_STATUSES.includes(normalizedStatus) ? normalizedStatus : null;
}

function parseDueDate(value) {
  if (value === null || value === undefined || value === "") {
    return { ok: true, value: null };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { ok: false, value: null };
  }

  return { ok: true, value: date };
}

export async function getTodos(request, response) {
  const userId = request.user.uid;
  let todos = await Todo.find({ userId }).sort({
    createdAt: -1
  });

  if (todos.length === 0) {
    const onboarding = await UserOnboarding.findOne({ userId });
    let shouldSeedSampleTasks = false;
    let shouldReloadTodos = false;

    if (!onboarding) {
      try {
        await UserOnboarding.create({
          userId,
          sampleTasksSeededAt: new Date()
        });
        shouldSeedSampleTasks = true;
      } catch (error) {
        if (error.code !== 11000) {
          throw error;
        }

        shouldReloadTodos = true;
      }
    }

    if (shouldSeedSampleTasks) {
      try {
        await Todo.insertMany(buildSampleTodos(userId));
      } catch (error) {
        await UserOnboarding.deleteOne({ userId });
        throw error;
      }

      shouldReloadTodos = true;
    }

    if (shouldReloadTodos) {
      todos = await Todo.find({ userId }).sort({
        createdAt: -1
      });
    }
  }

  response.json(todos.map(serializeTodo));
}

export async function createTodo(request, response) {
  const title = request.body?.title?.trim();
  const description =
    typeof request.body?.description === "string"
      ? request.body.description.trim()
      : "";
  const status = request.body?.status
    ? parseStatus(request.body.status)
    : "todo";
  const dueDate = parseDueDate(request.body?.dueDate);

  if (!title) {
    return response.status(400).json({
      message: "El titulo de la tarea es obligatorio."
    });
  }

  if (!status) {
    return response.status(400).json({
      message: "El estado de la tarea no es valido."
    });
  }

  if (!dueDate.ok) {
    return response.status(400).json({
      message: "La fecha de la tarea no es valida."
    });
  }

  const todo = await Todo.create({
    title,
    description,
    status,
    dueDate: dueDate.value,
    completed: status === "completed",
    userId: request.user.uid
  });

  return response.status(201).json(serializeTodo(todo));
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

  if (typeof request.body.description === "string") {
    updates.description = request.body.description.trim();
  }

  if (request.body.status !== undefined) {
    const status = parseStatus(request.body.status);

    if (!status) {
      return response.status(400).json({
        message: "El estado de la tarea no es valido."
      });
    }

    updates.status = status;
    updates.completed = status === "completed";
  }

  if (request.body.dueDate !== undefined) {
    const dueDate = parseDueDate(request.body.dueDate);

    if (!dueDate.ok) {
      return response.status(400).json({
        message: "La fecha de la tarea no es valida."
      });
    }

    updates.dueDate = dueDate.value;
  }

  if (typeof request.body.completed === "boolean") {
    updates.completed = request.body.completed;

    if (updates.status === undefined) {
      updates.status = request.body.completed ? "completed" : "todo";
    }
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

  return response.json(serializeTodo(todo));
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
