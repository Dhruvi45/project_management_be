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
router.get("/users", authorize("users", "view"), getUser);
router.get("/users/:id",authorize("users", "edit"), getUserById); 
router.put('/users/:id',authorize("users", "edit"), updateUser);
router.delete('/users/:id',authorize("users", "delete"), deleteUser);

// Route to get user list for dropdown
router.get("/usersList", getUserList);

// Login Route
router.post("/login", login);

export { router as userRouter };
