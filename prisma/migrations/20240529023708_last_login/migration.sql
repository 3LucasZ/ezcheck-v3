/*
  Warnings:

  - Changed the type of `timestamp` on the `Log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "lastLogin" INTEGER NOT NULL DEFAULT 0;
