import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty()
  isAdmin!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromPrisma(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      isAdmin: user.role === 'ADMIN',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
