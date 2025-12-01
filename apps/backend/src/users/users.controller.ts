import { Controller, Get, UseGuards, Request, Patch, Body, Post, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { AdminChangePasswordDto } from './dto/admin-change-password.dto';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: RequestWithUser): Promise<Omit<User, 'password'>> {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me/password')
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.changePassword(req.user.id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  async createUser(@Body() createUserDto: AdminCreateUserDto): Promise<Omit<User, 'password'>> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update user (Admin only)' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: AdminUpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.adminUpdate(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Patch(':id/password')
  @ApiOperation({ summary: 'Change user password (Admin only)' })
  async adminChangePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: AdminChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.adminChangePassword(id, changePasswordDto.newPassword);
    return { message: 'Password changed successfully' };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
