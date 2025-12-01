import prisma from '../index';
import { Prisma } from '@prisma/client';

export const inventoryRepo = {
    // Hotel operations
    async createHotel(data: Prisma.PartnerHotelCreateInput) {
        return prisma.partnerHotel.create({ data });
    },

    async findHotelsByPartnerId(partnerId: number) {
        return prisma.partnerHotel.findMany({
            where: { partnerId },
            include: {
                amenities: true,
                roomTypes: true,
                photos: true,
            },
        });
    },

    async findHotelsByCity(city: string) {
        return prisma.partnerHotel.findMany({
            where: { city },
            include: {
                amenities: true,
                roomTypes: true,
            },
        });
    },

    // Transport operations
    async createTransport(data: Prisma.PartnerTransportCreateInput) {
        return prisma.partnerTransport.create({ data });
    },

    async findTransportsByPartnerId(partnerId: number) {
        return prisma.partnerTransport.findMany({
            where: { partnerId },
        });
    },

    // Activity operations
    async createActivity(data: Prisma.PartnerActivityCreateInput) {
        return prisma.partnerActivity.create({ data });
    },

    async findActivitiesByPartnerId(partnerId: number) {
        return prisma.partnerActivity.findMany({
            where: { partnerId },
        });
    },
};
