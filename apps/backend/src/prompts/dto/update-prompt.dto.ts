import { ApiProperty } from '@nestjs/swagger';
import type { JsonValue } from '@prisma/client/runtime/library';
import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class UpdatePromptDto {
  @ApiProperty({ example: 'My Updated Cooking Video', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: {
      scene_1: {
        scene: {
          camera: { type: 'selfie-stick', angle: 'slightly below eye level' },
        },
      },
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  jsonData?: JsonValue;

  @ApiProperty({ example: ['cooking', 'tutorial'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @ApiProperty({ example: 4, required: false, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
