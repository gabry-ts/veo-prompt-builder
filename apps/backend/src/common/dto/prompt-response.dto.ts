import { ApiProperty } from '@nestjs/swagger';
import type { Prompt } from '@prisma/client';
import type { VeoPromptData } from '@meo-veo/shared';

export class PromptResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: 'object' })
  jsonData!: VeoPromptData;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty()
  isFavorite!: boolean;

  @ApiProperty({ required: false })
  rating?: number;

  @ApiProperty({ required: false })
  shareToken?: string | null;

  @ApiProperty()
  isPublic!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromPrisma(prompt: Prompt): PromptResponseDto {
    return {
      id: prompt.id,
      name: prompt.name,
      description: prompt.description ?? undefined,
      jsonData: prompt.jsonData as unknown as VeoPromptData,
      userId: prompt.userId,
      tags: prompt.tags,
      isFavorite: prompt.isFavorite,
      rating: prompt.rating ?? undefined,
      shareToken: prompt.shareToken,
      isPublic: prompt.isPublic,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    };
  }
}
