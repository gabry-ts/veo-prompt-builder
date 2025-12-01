import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { Prompt } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import type { CreatePromptDto } from './dto/create-prompt.dto';
import type { UpdatePromptDto } from './dto/update-prompt.dto';

@Injectable()
export class PromptsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createPromptDto: CreatePromptDto): Promise<Prompt> {
    const shareToken = createPromptDto.isPublic ? this.generateShareToken() : null;

    return this.prisma.prompt.create({
      data: {
        name: createPromptDto.name,
        description: createPromptDto.description,
        jsonData: createPromptDto.jsonData as Prisma.InputJsonValue,
        userId,
        tags: createPromptDto.tags || [],
        isFavorite: createPromptDto.isFavorite || false,
        rating: createPromptDto.rating,
        isPublic: createPromptDto.isPublic || false,
        shareToken,
      },
    });
  }

  private generateShareToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  async findAll(userId: string): Promise<Prompt[]> {
    return this.prisma.prompt.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Prompt> {
    const prompt = await this.prisma.prompt.findUnique({
      where: { id },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    if (prompt.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return prompt;
  }

  async update(id: string, userId: string, updatePromptDto: UpdatePromptDto): Promise<Prompt> {
    const existingPrompt = await this.findOne(id, userId);

    // Create version before updating if jsonData changed
    if (updatePromptDto.jsonData !== undefined) {
      await this.createVersion(existingPrompt);
    }

    // Generate shareToken if prompt is being made public and doesn't have one
    let shareToken = existingPrompt.shareToken;
    if (updatePromptDto.isPublic === true && !shareToken) {
      shareToken = this.generateShareToken();
    }

    return this.prisma.prompt.update({
      where: { id },
      data: {
        name: updatePromptDto.name,
        description: updatePromptDto.description,
        jsonData: updatePromptDto.jsonData as Prisma.InputJsonValue | undefined,
        tags: updatePromptDto.tags,
        isFavorite: updatePromptDto.isFavorite,
        rating: updatePromptDto.rating,
        isPublic: updatePromptDto.isPublic,
        shareToken,
      },
    });
  }

  private async createVersion(prompt: Prompt): Promise<void> {
    const latestVersion = await this.prisma.promptVersion.findFirst({
      where: { promptId: prompt.id },
      orderBy: { version: 'desc' },
    });

    const nextVersion = (latestVersion?.version ?? 0) + 1;

    await this.prisma.promptVersion.create({
      data: {
        promptId: prompt.id,
        name: prompt.name,
        description: prompt.description,
        jsonData: prompt.jsonData as Prisma.InputJsonValue,
        version: nextVersion,
      },
    });
  }

  async getVersions(
    promptId: string,
    userId: string,
  ): Promise<
    Array<{
      id: string;
      version: number;
      name: string;
      description: string | null;
      createdAt: Date;
    }>
  > {
    await this.findOne(promptId, userId);

    return this.prisma.promptVersion.findMany({
      where: { promptId },
      orderBy: { version: 'desc' },
      select: {
        id: true,
        version: true,
        name: true,
        description: true,
        createdAt: true,
      },
    });
  }

  async restoreVersion(promptId: string, versionId: string, userId: string): Promise<Prompt> {
    const prompt = await this.findOne(promptId, userId);

    const version = await this.prisma.promptVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.promptId !== promptId) {
      throw new NotFoundException('Version not found');
    }

    // Create a version of current state before restoring
    await this.createVersion(prompt);

    return this.prisma.prompt.update({
      where: { id: promptId },
      data: {
        name: version.name,
        description: version.description,
        jsonData: version.jsonData as Prisma.InputJsonValue,
      },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);

    await this.prisma.prompt.delete({
      where: { id },
    });
  }
}
