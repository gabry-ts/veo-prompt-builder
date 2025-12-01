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
    await this.findOne(id, userId);

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
