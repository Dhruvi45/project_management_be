import mongoose, { Schema, Document } from "mongoose";

export interface IPermission {
  resource: string; // e.g., "projects", "tasks", "users", "system"
  actions: string[]; // Allowed actions, e.g., ["create", "edit"]
}

export interface IRole extends Document {
  name: string; // Role name, e.g., "Admin"
  description: string; // Description of the role
  permissions: IPermission[]; // List of permissions for the role
  createdAt: Date; // Auto-generated timestamp
  updatedAt: Date; // Auto-generated timestamp
}

const PermissionSchema: Schema<IPermission> = new Schema(
  {
    resource: { type: String, required: true }, // e.g., "projects", "tasks"
    actions: { type: [String], required: true }, // e.g., ["create", "edit"]
  },
  { _id: false } // No unique _id for subdocuments
);

const RoleSchema: Schema<IRole> = new Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Admin"
    description: { type: String, required: true }, // Role description
    permissions: [PermissionSchema], // Permissions array
  },
  { timestamps: true }
);

const Role = mongoose.model<IRole>("Role", RoleSchema);

export default Role;
