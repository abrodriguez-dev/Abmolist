function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function buildSampleTodos(userId, now = new Date()) {
  return [
    {
      userId,
      title: "Organiza tu primera lista",
      description: "Define las tareas clave y mueve cada tarjeta segun avance.",
      status: "todo",
      dueDate: addDays(now, 1),
      completed: false
    },
    {
      userId,
      title: "Revisa el tablero Kanban",
      description: "Prueba a arrastrar esta tarjeta entre columnas.",
      status: "in_progress",
      dueDate: addDays(now, 3),
      completed: false
    },
    {
      userId,
      title: "Completa una tarea de ejemplo",
      description: "Marca esta tarjeta como referencia de trabajo terminado.",
      status: "completed",
      dueDate: addDays(now, -1),
      completed: true
    }
  ];
}
