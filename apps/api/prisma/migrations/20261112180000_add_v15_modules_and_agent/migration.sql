-- CreateEnum
CREATE TYPE "StrategyItemKind" AS ENUM ('ETAPE_MARCHE', 'POSITIONNEMENT', 'SECTION_PLAN');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('MENTOR', 'PARTENAIRE', 'INVESTISSEUR', 'CLIENT', 'FOURNISSEUR', 'AUTRE');

-- CreateEnum
CREATE TYPE "OpportunityKind" AS ENUM ('FINANCEMENT', 'INCUBATION', 'FORMATION', 'EVENEMENT', 'AUTRE');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('A_EXPLORER', 'EN_COURS', 'OBTENUE', 'ECARTEE');

-- CreateEnum
CREATE TYPE "BmcBlockType" AS ENUM ('PROPOSITION_VALEUR', 'SEGMENTS_CLIENTS', 'CANAUX', 'RELATIONS_CLIENTS', 'REVENUS', 'RESSOURCES_CLES', 'ACTIVITES_CLES', 'PARTENAIRES', 'STRUCTURE_COUTS');

-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('TACHE', 'ETAPE_STRATEGIE', 'POSITIONNEMENT', 'OBJECTIF', 'OPPORTUNITE', 'BLOC_BMC');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PROPOSEE', 'ACCEPTEE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "ProposalSource" AS ENUM ('AUTO', 'CHAT');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('USER', 'ASSISTANT');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "assignee_id" TEXT;

-- CreateTable
CREATE TABLE "strategy_items" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "kind" "StrategyItemKind" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "strategy_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "type" "ContactType" NOT NULL DEFAULT 'AUTRE',
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "kind" "OpportunityKind" NOT NULL DEFAULT 'AUTRE',
    "status" "OpportunityStatus" NOT NULL DEFAULT 'A_EXPLORER',
    "deadline" TIMESTAMP(3),
    "url" TEXT,
    "ai_suggested" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,
    "deadline" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bmc_blocks" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "block" "BmcBlockType" NOT NULL,
    "content" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bmc_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "type" "ProposalType" NOT NULL,
    "title" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PROPOSEE',
    "source" "ProposalSource" NOT NULL DEFAULT 'AUTO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_at" TIMESTAMP(3),

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "strategy_items_project_id_kind_idx" ON "strategy_items"("project_id", "kind");

-- CreateIndex
CREATE INDEX "team_members_project_id_idx" ON "team_members"("project_id");

-- CreateIndex
CREATE INDEX "contacts_project_id_idx" ON "contacts"("project_id");

-- CreateIndex
CREATE INDEX "opportunities_project_id_idx" ON "opportunities"("project_id");

-- CreateIndex
CREATE INDEX "goals_project_id_idx" ON "goals"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "bmc_blocks_project_id_block_key" ON "bmc_blocks"("project_id", "block");

-- CreateIndex
CREATE INDEX "proposals_project_id_status_idx" ON "proposals"("project_id", "status");

-- CreateIndex
CREATE INDEX "chat_messages_project_id_created_at_idx" ON "chat_messages"("project_id", "created_at");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_items" ADD CONSTRAINT "strategy_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bmc_blocks" ADD CONSTRAINT "bmc_blocks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

