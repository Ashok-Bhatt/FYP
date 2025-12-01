import { Request, Response } from 'express';
import { requirementRepo } from '../db';
import prisma from '../db';
import { handleError } from '../utils/errorHandler';

// @desc    Create a new requirement (Public)
// @route   POST /api/requirements
// @access  Public
export const createRequirement = async (req: Request, res: Response) => {
    try {
        const { destination, tripType, budget, startDate, duration, pax, hotelStar, preferences, contactInfo } = req.body;

        // Create contact if provided
        let contactId: number | undefined;
        if (contactInfo) {
            const contact = await prisma.contact.create({
                data: {
                    name: contactInfo.name,
                    email: contactInfo.email,
                    phone: contactInfo.phone,
                    whatsapp: contactInfo.whatsapp || null,
                },
            });
            contactId = contact.id;
        }

        const requirement = await requirementRepo.create({
            destination,
            tripType,
            budget,
            startDate: startDate ? new Date(startDate) : null,
            duration: duration || null,
            adults: pax?.adults || 1,
            children: pax?.children || 0,
            hotelStar: hotelStar || null,
            status: 'NEW',
            contact: contactId ? { connect: { id: contactId } } : undefined,
            preferences: preferences && preferences.length > 0
                ? { create: preferences.map((pref: string) => ({ name: pref })) }
                : undefined,
        });

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
        const requirements = await requirementRepo.findAll();
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
        const requirement = await requirementRepo.findById(parseInt(req.params.id));
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
        const updatedRequirement = await requirementRepo.updateStatus(parseInt(req.params.id), status);
        res.json(updatedRequirement);
    } catch (error: unknown) {
        handleError(res, error, 'Error updating requirement status');
    }
};

// @desc    Delete requirement
// @route   DELETE /api/requirements/:id
// @access  Private (Agent)
export const deleteRequirement = async (req: Request, res: Response) => {
    try {
        await prisma.requirement.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Requirement removed' });
    } catch (error: unknown) {
        handleError(res, error, 'Error deleting requirement');
    }
};

