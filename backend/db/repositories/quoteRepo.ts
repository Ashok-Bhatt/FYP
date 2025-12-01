import prisma from '../index';
import { Prisma } from '@prisma/client';

export const quoteRepo = {
    async create(data: Prisma.QuoteCreateInput) {
        return prisma.quote.create({ data });
    },

    async findById(id: number) {
        return prisma.quote.findUnique({
            where: { id },
            include: {
                hotels: true,
                transport: true,
                activities: true,
                requirement: true,
                partner: true,
                agent: true,
            },
        });
    },

    async findByRequirementId(requirementId: number) {
        return prisma.quote.findMany({
            where: { requirementId },
            include: {
                hotels: true,
                transport: true,
                activities: true,
            },
        });
    },

    async updateStatus(id: number, status: any) {
        return prisma.quote.update({
            where: { id },
            data: { status },
        });
    },
};
