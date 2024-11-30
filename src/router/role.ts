import express from "express";
import { getRoleList, getRoleTeamMemberList } from "../controller/role";
import { authorize } from "../middleware/authorize";

const router = express.Router();

// Route to get role list for dropdown
router.get("/roles/list", authorize("users", "create"), getRoleList);

// Route to get role list for dropdown
router.get("/roles/tmlist", authorize("users", "create_teamMember"), getRoleTeamMemberList);
export { router as roleRouter };
