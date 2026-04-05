import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo
} from "../controllers/todoController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);
router.get("/", getTodos);
router.post("/", createTodo);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;

