import { Request, Response } from "express";
import Role from "../model/role";

// Controller to fetch roles for dropdown
export const getRoleList = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch roles from the database
    const roles = await Role.find().select("_id name");   

    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};

// Controller to fetch roles for dropdown where role is Team Member
export const getRoleTeamMemberList = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch roles where name is "Team Member"
    const roles = await Role.find({ name: "Team Member" }).select("_id name");

    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};
