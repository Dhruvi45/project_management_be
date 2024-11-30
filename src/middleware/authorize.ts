import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Role from "../model/role";
import { getJwtSecret } from "../config";

interface Permission {
  resource: string;
  actions: string[];
}

interface Role {
  // _id: string;
  name: string;
  permissions: Permission[];
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: Role; // Role type here
  };
}

// Define the structure of the decoded JWT
interface DecodedToken {
  userId: string;
  role: string; // This will be the role ID from the JWT
}

export const authorize = (resource: string, action: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, getJwtSecret()) as DecodedToken; // Use DecodedToken interface
      console.log(decoded);

      const userRoleId = decoded.role;
      const role = await Role.findById(userRoleId).exec();

      if (!role) {
        res.status(403).json({ message: "Forbidden: Role not found" });
        return;
      }

      const permission = role.permissions.find((p) => p.resource === resource);
      if (!permission || !permission.actions.includes(action)) {
        res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        return;
      }

      // Attach userId and full role object to request
      req.user = { userId: decoded.userId, role: role };

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};
