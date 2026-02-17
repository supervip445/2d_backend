import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    
    next();
  };
}; 