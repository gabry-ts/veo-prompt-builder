import { ApiProperty } from '@nestjs/swagger';
import type { JsonValue } from '@prisma/client/runtime/library';
import { IsString, IsOptional, IsObject } from 'class-validator';

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
}
