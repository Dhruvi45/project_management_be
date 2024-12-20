import mongoose from "mongoose";
import Role from "./model/role";

const seedRoles = async () => {
  try {
    // Data to be inserted
    const roles = [
      {
        _id: new mongoose.Types.ObjectId("6745f98c35a8a8283dba9a88"),
        name: "Admin",
        description: "Full access to all resources and actions in the system.",
        permissions: [
          { resource: "projects", actions: ["create", "edit", "delete", "view"] },
          {
            resource: "tasks", actions: ["create", "edit", "delete", "view"],
          },
          { resource: "users", actions: ["create", "edit", "delete", "view"] },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("6745fa4535a8a8283dba9a89"),
        name: "Project Manager",
        description: "Manages projects and assigns tasks to team members.",
        permissions: [
          { resource: "projects", actions: ["create", "edit", "view", "delete"] },
          { resource: "tasks", actions: ["create", "edit", "delete", "view"] },
          { resource: "users", actions: ["create_teamMember", "view_teamMember", "edit_teamMember", "delete_teamMember"] },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("6745fa8e35a8a8283dba9a8a"),
        name: "Team Member",
        description: "Contributes to tasks assigned to them and can view projects.",
        permissions: [
          { resource: "projects", actions: ["view"] },
          { resource: "tasks", actions: ["edit_detail", "view"] },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("6745faca35a8a8283dba9a8b"),
        name: "Guest",
        description: "Limited access to view projects only.",
        permissions: [{ resource: "projects", actions: ["view"] }],
      },
    ];

    // Insert roles into the database
    await Role.insertMany(roles);
    console.log("Roles seeded successfully");

  } catch (error) {
    console.error("Error seeding roles:", error);
  }
};

seedRoles();
