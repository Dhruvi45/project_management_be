import { Request, Response } from "express";
import mongoose from "mongoose";
import Project from "../model/project";
import User from "../model/user";

// CREATE: Add a new project
export const addProject = async (req: Request, res: Response) => {
  try {
    const { title, description, owner, members } = req.body;

    // Validate the owner (Project Manager)
    const ownerExists = await User.findById(owner);
    if (!ownerExists) {
      res
        .status(404)
        .json({ error: "Owner (Project Manager) not found" });
    } else {
      // Validate the members (Team Members)
      const membersExist = await User.find({ _id: { $in: members } });
      if (membersExist.length !== members.length) {
        res.status(404).json({ error: "Some team members not found" });
      } else {
        const newProject = new Project({ title, description, owner, members });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// READ: Get all projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.aggregate([
      {
        $lookup: {
          from: "users", // The collection name for 'owner'
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $lookup: {
          from: "users", // The collection name for 'members'
          localField: "members",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      {
        $addFields: {
          owner: { $arrayElemAt: ["$ownerDetails.name", 0] }, // Extract owner name
          members: { $map: { input: "$memberDetails", as: "member", in: "$$member.name" } }, // Extract member names
        },
      },
      {
        $addFields: {
          members: { $reduce: { input: "$members", initialValue: "", in: { $concat: ["$$value", { $cond: [{ $eq: ["$$value", ""] }, "", ", "] }, "$$this"] } } }, // Create comma-separated members
        },
      },
      {
        $project: {
          ownerDetails: 0, // Exclude unnecessary fields
          memberDetails: 0,
          tasks: 0,
          __v: 0,
        },
      },
    ]);
    res.status(200).json(projects);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// READ: Get a single project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
    // .populate("owner", "name email")
    // .populate("members", "name email");
    if (!project) {
      res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// UPDATE: Update a project by ID
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { title, description, owner, members } = req.body;

    // Validate the owner (Project Manager)
    if (owner) {
      const ownerExists = await User.findById(owner);
      if (!ownerExists) {
        res.status(404).json({ error: "Owner not found" });
      }
    }

    // Validate the members (Team Members)
    if (members) {
      const membersExist = await User.find({ _id: { $in: members } });
      if (membersExist.length !== members.length) {
        {
          res.status(404).json({ error: "Some team members not found" });
        }
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, owner, members },
      { new: true, runValidators: true }
    )
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!updatedProject) {
      res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// DELETE: Remove a project by ID
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Controller to fetch project for dropdown
export const getProjectList = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch roles from the database
    const peojects = await Project.find().select("_id title");
    res.status(200).json({ success: true, data: peojects });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};

// Controller to fetch project member for dropdown
export const getProjectMemberList = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.params.id)
    // Fetch roles from the database
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'members',
        select: 'id name', // Select only the `id` and `name` fields of the members
      })
      .exec();

    if (!project) {
      console.log('Project not found');
      res.status(404).json({ error: "Project not found" });
    } else {

      // Extract members
      const members = project.members.map((member: any) => ({
        _id: member._id,
        name: member.name,
      }));
      res.status(200).json({ success: true, data: members });
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};
