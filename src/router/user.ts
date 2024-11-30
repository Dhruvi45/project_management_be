import express, { Router, Request, Response, Application } from 'express'; // Import necessary types
import {
  addUser,
  deleteUser,
  getUser,
  getUserById,
  getUserList,
  login,
  updateUser,
} from "../controller/user";
import { authorize } from '../middleware/authorize';

// Create a router instance
const router = express.Router();

router.post("/users", addUser);
router.get("/users", authorize("users", "change_roles"), getUser);
router.get("/users/:id", getUserById); 
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Route to get user list for dropdown
router.get("/usersList", getUserList);

// Login Route
router.post("/login", login);

export { router as userRouter };
