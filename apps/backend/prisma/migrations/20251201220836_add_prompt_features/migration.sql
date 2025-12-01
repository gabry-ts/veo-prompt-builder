-- AlterTable
ALTER TABLE "prompts" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "rating" INTEGER,
ADD COLUMN "shareToken" TEXT,
ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "prompt_versions" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "jsonData" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prompts_shareToken_key" ON "prompts"("shareToken");

-- CreateIndex
CREATE INDEX "prompts_shareToken_idx" ON "prompts"("shareToken");

-- CreateIndex
CREATE INDEX "prompt_versions_promptId_idx" ON "prompt_versions"("promptId");

-- AddForeignKey
ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
