import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Task from '../model/task';
import Project from '../model/project';
import User from '../model/user';

// CREATE: Add a new task
export const addTask = async (req: Request, res: Response) => {
  try {
    const { title, description, completed, dueDate, assignedTo, project } = req.body;

    // Validate the project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) { res.status(404).json({ error: 'Project not found' });}

    // Validate the assigned user exists
    const userExists = await User.findById(assignedTo);
    if (!userExists) { res.status(404).json({ error: 'Assigned user not found' });}

    const newTask = new Task({ title, description, completed, dueDate, assignedTo, project });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// READ: Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.aggregate([
      {
        $lookup: {
          from: 'users', // Replace 'users' with your actual collection name for 'assignedTo'
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedTo',
        },
      },
      {
        $lookup: {
          from: 'projects', // Replace 'projects' with your actual collection name for 'project'
          localField: 'project',
          foreignField: '_id',
          as: 'project',
        },
      },
      {
        $unwind: '$assignedTo', // Assuming assignedTo is a single reference
      },
      {
        $unwind: '$project', // Assuming project is a single reference
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          completed: {
            $cond: { if: { $eq: ['$completed', true] }, then: 'Yes', else: 'No' },
          }, // Converts true/false to Yes/No
          dueDate: 1,
          assignedTo: '$assignedTo.name', // Flatten assignedTo to just the name
          projectTitle: '$project.title', // Rename project to projectTitle
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    res.status(200).json(tasks);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// READ: Get a single task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      // .populate('assignedTo', 'name email')
      // .populate('project', 'title');
    if (!task) { res.status(404).json({ error: 'Task not found' });}
    res.status(200).json(task);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// UPDATE: Update a task by ID
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { title, description, completed, dueDate, assignedTo, project } = req.body;

    // Validate the project and assigned user
    if (project) {
      const projectExists = await Project.findById(project);
      if (!projectExists) { res.status(404).json({ error: 'Project not found' });}
    }
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) { res.status(404).json({ error: 'Assigned user not found' });}
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, dueDate, assignedTo, project },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('project', 'title');

    if (!updatedTask){  res.status(404).json({ error: 'Task not found' });}
    res.status(200).json(updatedTask);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// DELETE: Remove a task by ID
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask){  res.status(404).json({ error: 'Task not found' });}
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
