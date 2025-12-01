import prisma from '../index';
import { Prisma } from '@prisma/client';

export const partnerRepo = {
    async create(data: Prisma.PartnerProfileCreateInput) {
        return prisma.partnerProfile.create({ data });
    },

    async findById(id: number) {
        return prisma.partnerProfile.findUnique({
            where: { id },
            include: {
                user: true,
                destinations: true,
                specializations: true,
                images: true,
                amenities: { include: { amenity: true } },
                sightSeeing: true,
            },
        });
    },

    async findByUserId(userId: number) {
        return prisma.partnerProfile.findUnique({
            where: { userId },
            include: {
                destinations: true,
                images: true,
            },
        });
    },

    async findAll(skip: number = 0, take: number = 10) {
        return prisma.partnerProfile.findMany({
            skip,
            take,
            include: {
                user: true,
                destinations: true,
            },
        });
    },
};
