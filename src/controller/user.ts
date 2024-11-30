import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../model/user";
import Role from "../model/role";
import { roleConstent } from "../commonConst";

// CREATE: Add a new user
export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// READ: Get all users
export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "roles", // Collection name for Role
          localField: "role",
          foreignField: "_id",
          as: "roleInfo", // Role information will be stored here temporarily
        },
      },
      {
        $unwind: {
          path: "$roleInfo", // Unwind the array created by $lookup
          preserveNullAndEmptyArrays: false, // Omit users without a valid role reference
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          password: 1,
          role: "$roleInfo.name", // Replace `role` with the `name` from Role
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
        },
      },
    ]);
    res.status(200).json(users);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// READ: Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// UPDATE: Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password, role },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// DELETE: Remove a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Controller to fetch users for dropdown
export const getUserList = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch roles from the database
    const roleKey = req.query.role as string;

    if (!Object.keys(roleConstent).includes(roleKey)) {
      res.status(400).json({ success: false, message: "Invalid role provided" });
      return;
    }

    const roleName = roleConstent[roleKey as keyof typeof roleConstent];

    // Query the Role model
    const role = await Role.findOne({ name: roleName });
   if (!role) {
     res.status(404).json({ success: false, message: "Role not found" });
     return;
   }

   // Fetch users with the specific role
   const users = await User.find({ role: role._id }).select("_id name email");
   
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};
