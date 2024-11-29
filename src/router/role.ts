import express from "express";
import { getRoleList } from "../controller/role";

const router = express.Router();

// Route to get role list for dropdown
router.get("/roles/list", getRoleList);

export { router as roleRouter };
