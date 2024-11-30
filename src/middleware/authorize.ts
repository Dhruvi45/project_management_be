import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Role from "../model/role";
import { getJwtSecret } from "../config";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authorize = (resource: string, action: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('resource', resource, action)
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        getJwtSecret()
      ) as { userId: string; role: string };
console.log(decoded)
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

      req.user = decoded; // Attach user to request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};
