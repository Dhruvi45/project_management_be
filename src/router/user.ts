import express, { Router, Request, Response } from 'express'; // Import necessary types
import {
  addUser,
  deleteUser,
  getUser,
  getUserById,
  updateUser,
} from "../controller/user";

// Create a router instance
const router: Router = express.Router();

router.post("/users", addUser);
router.get("/users", getUser);
router.get("/users/:id", getUserById); 
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export { router as userRouter };