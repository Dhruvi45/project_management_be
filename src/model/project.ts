import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user'; // Import User model

export interface IProject extends Document {
  title: string;
  description: string;
  owner: IUser; // Reference to the User model (Project Manager)
  members: IUser[]; // Array of Users (team members)
  tasks: mongoose.Types.ObjectId[]; // Array of Task IDs
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;