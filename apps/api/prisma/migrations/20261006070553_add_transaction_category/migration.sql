/*
  Warnings:

  - The `category` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('MARKETING', 'DEVELOPPEMENT', 'LOGISTIQUE', 'SALAIRES', 'LOYER', 'MATERIEL', 'ADMINISTRATIF', 'AUTRE');

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "category",
ADD COLUMN     "category" "TransactionCategory" DEFAULT 'AUTRE';
