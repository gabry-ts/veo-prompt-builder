import { ApiProperty } from '@nestjs/swagger';
import type { JsonValue } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

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
}
