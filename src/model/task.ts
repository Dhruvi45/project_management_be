import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from './project'; // Import Project model
import { IUser } from './user'; // Import User model

interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
  assignedTo: IUser; // User assigned to the task
  project: IProject; // Reference to the associated project
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;