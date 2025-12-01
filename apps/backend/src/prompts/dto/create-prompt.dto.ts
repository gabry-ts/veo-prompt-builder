import { ApiProperty } from '@nestjs/swagger';
import type { JsonValue } from '@prisma/client/runtime/library';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreatePromptDto {
  @ApiProperty({ example: 'My Cooking Video' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'A video about cooking pasta', required: false })
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
  })
  @IsObject()
  @IsNotEmpty()
  jsonData!: JsonValue;

  @ApiProperty({ example: ['cooking', 'tutorial'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @ApiProperty({ example: 5, required: false, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
