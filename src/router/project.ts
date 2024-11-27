import express from 'express';
import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controller/project';

const router = express.Router();

// CRUD operations for Project
router.post('/projects', addProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export { router as projectRouter };

