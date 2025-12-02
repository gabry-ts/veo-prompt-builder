import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { Prompt } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import type { CreatePromptDto } from './dto/create-prompt.dto';
import type { UpdatePromptDto } from './dto/update-prompt.dto';
import type { QueryPromptsDto } from './dto/query-prompts.dto';

@Injectable()
export class PromptsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createPromptDto: CreatePromptDto): Promise<Prompt> {
    const shareToken = createPromptDto.isPublic ? this.generateShareToken() : null;

    return this.prisma.prompt.create({
      data: {
        name: createPromptDto.name,
        description: createPromptDto.description,
        jsonData: createPromptDto.jsonData as unknown as Prisma.InputJsonValue,
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

  async findAllPaginated(
    userId: string,
    query: QueryPromptsDto,
  ): Promise<{ data: Prompt[]; nextCursor: string | null; hasMore: boolean }> {
    const { limit = 20, cursor } = query;

    const prompts = await this.prisma.prompt.findMany({
      where: { userId },
      take: limit + 1, // Take one extra to check if there are more
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor itself
      }),
      orderBy: { updatedAt: 'desc' },
    });

    const hasMore = prompts.length > limit;
    const data = hasMore ? prompts.slice(0, limit) : prompts;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return {
      data,
      nextCursor,
      hasMore,
    };
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

  async deleteBulk(ids: string[], userId: string): Promise<{ deleted: number }> {
    // Verify all prompts belong to the user
    const prompts = await this.prisma.prompt.findMany({
      where: {
        id: { in: ids },
        userId,
      },
      select: { id: true },
    });

    const foundIds = prompts.map((p) => p.id);
    if (foundIds.length !== ids.length) {
      throw new ForbiddenException('Some prompts do not belong to you or do not exist');
    }

    const result = await this.prisma.prompt.deleteMany({
      where: {
        id: { in: foundIds },
        userId,
      },
    });

    return { deleted: result.count };
  }

  private extractPromptData(rawData: Record<string, unknown>): Record<string, unknown> {
    return rawData.prompt !== null &&
      rawData.prompt !== undefined &&
      typeof rawData.prompt === 'object' &&
      !Array.isArray(rawData.prompt)
      ? (rawData.prompt as Record<string, unknown>)
      : rawData;
  }

  private buildTimelineMarkdown(timeline: unknown[]): string {
    let markdown = `## Timeline\n\n`;
    timeline.forEach((step: unknown, index: number) => {
      if (typeof step === 'object' && step !== null) {
        const typedStep = step as Record<string, unknown>;
        markdown += `### Step ${index + 1}\n\n`;
        Object.entries(typedStep).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            markdown += `- **${key}**: ${JSON.stringify(value)}\n`;
          }
        });
        markdown += `\n`;
      }
    });
    return markdown;
  }

  private buildAudioMarkdown(audio: Record<string, unknown>): string {
    let markdown = `## Audio\n\n`;
    Object.entries(audio).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        markdown += `- **${key}**: ${JSON.stringify(value)}\n`;
      }
    });
    return `${markdown}\n`;
  }

  async exportToMarkdown(id: string, userId: string): Promise<string> {
    const prompt = await this.findOne(id, userId);
    const data = this.extractPromptData(prompt.jsonData as Record<string, unknown>);

    let markdown = `# ${prompt.name}\n\n`;
    if (prompt.description) {
      markdown += `${prompt.description}\n\n`;
    }
    markdown += `---\n\n`;

    if (typeof data.prompt_text === 'string' && data.prompt_text.length > 0) {
      markdown += `## Prompt Text\n\n${data.prompt_text}\n\n`;
    }

    if (Array.isArray(data.timeline) && data.timeline.length > 0) {
      markdown += this.buildTimelineMarkdown(data.timeline);
    }

    if (typeof data.audio === 'object' && data.audio !== null && !Array.isArray(data.audio)) {
      markdown += this.buildAudioMarkdown(data.audio as Record<string, unknown>);
    }

    markdown += `---\n\n`;
    markdown += `**Tags**: ${prompt.tags.join(', ') || 'None'}\n`;
    markdown += `**Rating**: ${'⭐'.repeat(prompt.rating ?? 0)}\n`;
    markdown += `**Favorite**: ${prompt.isFavorite ? '⭐' : '❌'}\n`;

    return markdown;
  }

  async findByShareToken(shareToken: string): Promise<Prompt> {
    const prompt = await this.prisma.prompt.findFirst({
      where: {
        shareToken,
        isPublic: true,
      },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found or not public');
    }

    return prompt;
  }
}
