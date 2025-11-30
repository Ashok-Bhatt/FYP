import { Response } from 'express';

export const handleError = (res: Response, error: unknown, message: string = 'Server Error') => {
    console.error(message, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: errorMessage });
};
