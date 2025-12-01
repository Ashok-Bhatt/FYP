import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { userRepo } from '../db';
import { User } from '@prisma/client';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

interface DecodedToken {
    id: number;
    iat: number;
    exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

            const user = await userRepo.findById(decoded.id);

            if (!user) {
                res.status(401).json({ message: 'User not found' });
                return;
            }

            // Remove password from user object
            const { password, ...userWithoutPassword } = user;
            req.user = userWithoutPassword as User;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user?.role} is not authorized to access this route`
            });
        }
        next();
    };
};
