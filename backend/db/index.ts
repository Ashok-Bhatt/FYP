import { PrismaClient } from '@prisma/client';
import { userRepo } from './repositories/userRepo';
import { partnerRepo } from './repositories/partnerRepo';
import { requirementRepo } from './repositories/requirementRepo';
import { quoteRepo } from './repositories/quoteRepo';

const prisma = new PrismaClient();

export default prisma;

export {
    userRepo,
    partnerRepo,
    requirementRepo,
    quoteRepo,
};
