import { Request, Response } from 'express';
import { userRepo } from '../db';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/errorHandler';
import bcrypt from 'bcryptjs';

// Generate JWT
const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, role, companyName, destinations } = req.body;

    try {
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please add all fields' });
            return;
        }

        const userExists = await userRepo.findByEmail(email);

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userRepo.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'AGENT',
            companyName: companyName || null,
            destinations: destinations && destinations.length > 0
                ? { create: destinations.map((city: string) => ({ city })) }
                : undefined,
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
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
        const user = await userRepo.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: unknown) {
        handleError(res, error, 'Login failed');
    }
};

