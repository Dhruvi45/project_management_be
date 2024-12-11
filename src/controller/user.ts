import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../model/user";
import Role from "../model/role";
import { roleConstent } from "../commonConst";
import { getJwtSecret } from "../config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/authorize";

// CREATE: Add a new user
export const addUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "Email is already in use" });
      return;
    }

    if(req.user?.role?.name ==="Project Manager" && role !=="6745fa8e35a8a8283dba9a8a" ){
      res.status(400).json({ error: "You have only rights to create team member" });
      return;
    }
    
    // Hash the password
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance with the hashed password
    const newUser = new User({ name, email, password: hashedPassword, role });

    // Save the user to the database
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
export const getUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// READ: Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("_id name email role");
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

// Login Controller
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user: IUser | null = await User.findOne({ email }).populate("role");

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {

      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        getJwtSecret(),
        { expiresIn: "1h" }
      );

      res.status(200).json({ token, userId: user._id, role: user.role.name});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
