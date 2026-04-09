import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/errorHandler';
import { JWT_SECRET } from '../config/env';

// Generate JWT
const generateToken = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, role, companyName } = req.body;

    try {
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please add all fields' });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            companyName,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken((user._id as unknown) as string),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: unknown) {
        handleError(res, error, 'Registration failed');
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken((user._id as unknown) as string),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: unknown) {
        handleError(res, error, 'Login failed');
    }
};
