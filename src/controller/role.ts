import { Request, Response } from "express";
import Role from "../model/role";

// Controller to fetch roles for dropdown
export const getRoleList = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch roles from the database
    const roles = await Role.find({}, { _id: 1, name: 1 });

    // Transform the result for dropdown
    const roleList = roles.map(role => ({
      id: role._id,
      name: role.name,
    }));

    res.status(200).json({ success: true, data: roleList });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};
