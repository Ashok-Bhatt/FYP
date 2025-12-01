import prisma from '../index';
import { Prisma } from '@prisma/client';

export const userRepo = {
    async create(data: Prisma.UserCreateInput) {
        return prisma.user.create({ data });
    },

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async findById(id: number) {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    async update(id: number, data: Prisma.UserUpdateInput) {
        return prisma.user.update({
            where: { id },
            data,
        });
    },
};
