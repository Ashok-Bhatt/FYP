-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AGENT', 'PARTNER', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('DMC', 'Hotel', 'CabProvider', 'Mixed');

-- CreateEnum
CREATE TYPE "RequirementStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'QUOTES_READY', 'SENT_TO_USER', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'READY', 'SENT_TO_USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AGENT',
    "companyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDestination" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "UserDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "type" "PartnerType" NOT NULL DEFAULT 'DMC',
    "budgetMin" DOUBLE PRECISION,
    "budgetMax" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "tripsHandled" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "startingPrice" DOUBLE PRECISION,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerDestination" (
    "id" SERIAL NOT NULL,
    "partnerProfileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PartnerDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerSpecialization" (
    "id" SERIAL NOT NULL,
    "partnerProfileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PartnerSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerImage" (
    "id" SERIAL NOT NULL,
    "partnerProfileId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "PartnerImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerAmenity" (
    "id" SERIAL NOT NULL,
    "partnerProfileId" INTEGER NOT NULL,
    "amenityId" INTEGER NOT NULL,

    CONSTRAINT "PartnerAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerSightSeeing" (
    "id" SERIAL NOT NULL,
    "partnerProfileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PartnerSightSeeing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerHotel" (
    "id" SERIAL NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "starRating" INTEGER,

    CONSTRAINT "PartnerHotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerHotelAmenity" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PartnerHotelAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerHotelRoomType" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "maxOccupancy" INTEGER NOT NULL,

    CONSTRAINT "PartnerHotelRoomType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerHotelPhoto" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "PartnerHotelPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerTransport" (
    "id" SERIAL NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "maxPax" INTEGER NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "PartnerTransport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerActivity" (
    "id" SERIAL NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "PartnerActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" SERIAL NOT NULL,
    "destination" TEXT NOT NULL,
    "tripType" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3),
    "duration" INTEGER,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "hotelStar" INTEGER,
    "status" "RequirementStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactId" INTEGER,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementPreference" (
    "id" SERIAL NOT NULL,
    "requirementId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RequirementPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "requirementId" INTEGER NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "agentId" INTEGER NOT NULL,
    "title" TEXT,
    "costs" JSONB,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteHotel" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "qty" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QuoteHotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteTransport" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QuoteTransport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteActivity" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "qty" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QuoteActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerProfile_userId_key" ON "PartnerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_name_key" ON "Amenity"("name");

-- AddForeignKey
ALTER TABLE "UserDestination" ADD CONSTRAINT "UserDestination_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerProfile" ADD CONSTRAINT "PartnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerDestination" ADD CONSTRAINT "PartnerDestination_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerSpecialization" ADD CONSTRAINT "PartnerSpecialization_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerImage" ADD CONSTRAINT "PartnerImage_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerAmenity" ADD CONSTRAINT "PartnerAmenity_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerAmenity" ADD CONSTRAINT "PartnerAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerSightSeeing" ADD CONSTRAINT "PartnerSightSeeing_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerHotel" ADD CONSTRAINT "PartnerHotel_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerHotelAmenity" ADD CONSTRAINT "PartnerHotelAmenity_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "PartnerHotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerHotelRoomType" ADD CONSTRAINT "PartnerHotelRoomType_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "PartnerHotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerHotelPhoto" ADD CONSTRAINT "PartnerHotelPhoto_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "PartnerHotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerTransport" ADD CONSTRAINT "PartnerTransport_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerActivity" ADD CONSTRAINT "PartnerActivity_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementPreference" ADD CONSTRAINT "RequirementPreference_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteHotel" ADD CONSTRAINT "QuoteHotel_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteTransport" ADD CONSTRAINT "QuoteTransport_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteActivity" ADD CONSTRAINT "QuoteActivity_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
