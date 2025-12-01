-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable: Add role column with default USER
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- Set all existing users to ADMIN
UPDATE "users" SET "role" = 'ADMIN';
