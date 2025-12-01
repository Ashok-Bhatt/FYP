import prisma from '../index';
import { Prisma } from '@prisma/client';

export const requirementRepo = {
    async create(data: Prisma.RequirementCreateInput) {
        return prisma.requirement.create({ data });
    },

    async findById(id: number) {
        return prisma.requirement.findUnique({
            where: { id },
            include: {
                contact: true,
                preferences: true,
                quotes: true,
            },
        });
    },

    async findAll(skip: number = 0, take: number = 10) {
        return prisma.requirement.findMany({
            skip,
            take,
            include: {
                contact: true,
                preferences: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async updateStatus(id: number, status: any) {
        return prisma.requirement.update({
            where: { id },
            data: { status },
        });
    },
};
