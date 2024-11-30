import express from 'express';
import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectList,
  getProjectMemberList,
  getProjectsByUser
} from '../controller/project';
import { authorize } from '../middleware/authorize';

const router = express.Router();

// CRUD operations for Project
router.post('/projects', authorize("projects", "create"), addProject);
router.get('/projects', authorize("projects", "view"), getProjects);
router.get('/projects/:id', authorize("projects", "edit"), getProjectById);
router.put('/projects/:id', authorize("projects", "edit"), updateProject);
router.delete('/projects/:id', authorize("projects", "delete"), deleteProject);
router.get('/projectsByUserId', authorize("projects", "view"), getProjectsByUser);

// Route to get user list for dropdown
router.get("/projectList", getProjectList);

// Route to get project member list for dropdown
router.get("/projectMemberList/:id", getProjectMemberList);

export { router as projectRouter };

