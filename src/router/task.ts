import express from 'express';
import {
  addTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controller/task';

const router = express.Router();

// CRUD operations for Task
router.post('/tasks', addTask);
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export { router as taskRouter };

