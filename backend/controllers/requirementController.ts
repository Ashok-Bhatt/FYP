import { Request, Response } from 'express';
import Requirement from '../models/Requirement';
import { handleError } from '../utils/errorHandler';

// @desc    Create a new requirement (Public)
// @route   POST /api/requirements
// @access  Public
export const createRequirement = async (req: Request, res: Response) => {
    try {
        const requirement = await Requirement.create(req.body);
        res.status(201).json(requirement);
    } catch (error: unknown) {
        handleError(res, error, 'Error creating requirement');
    }
};

// @desc    Get all requirements (Agent)
// @route   GET /api/requirements
// @access  Private (Agent)
export const getRequirements = async (req: Request, res: Response) => {
    try {
        const requirements = await Requirement.find({}).sort({ createdAt: -1 });
        res.json(requirements);
    } catch (error: unknown) {
        handleError(res, error, 'Error fetching requirements');
    }
};

// @desc    Get requirement by ID
// @route   GET /api/requirements/:id
// @access  Private (Agent)
export const getRequirementById = async (req: Request, res: Response) => {
    try {
        const requirement = await Requirement.findById(req.params.id);
        if (requirement) {
            res.json(requirement);
        } else {
            res.status(404).json({ message: 'Requirement not found' });
        }
    } catch (error: unknown) {
        handleError(res, error, 'Error fetching requirement');
    }
};

// @desc    Update requirement status
// @route   PUT /api/requirements/:id/status
// @access  Private (Agent)
export const updateRequirementStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const requirement = await Requirement.findById(req.params.id);

        if (requirement) {
            requirement.status = status;
            const updatedRequirement = await requirement.save();
            res.json(updatedRequirement);
        } else {
            res.status(404).json({ message: 'Requirement not found' });
        }
    } catch (error: unknown) {
        handleError(res, error, 'Error updating requirement status');
    }
};

// @desc    Delete requirement
// @route   DELETE /api/requirements/:id
// @access  Private (Agent)
export const deleteRequirement = async (req: Request, res: Response) => {
    try {
        const requirement = await Requirement.findById(req.params.id);
        if (requirement) {
            await Requirement.findByIdAndDelete(req.params.id);
            res.json({ message: 'Requirement removed' });
        } else {
            res.status(404).json({ message: 'Requirement not found' });
        }
    } catch (error: unknown) {
        handleError(res, error, 'Error deleting requirement');
    }
};
