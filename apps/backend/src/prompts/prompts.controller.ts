import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { PromptsService } from './prompts.service';
import { PromptResponseDto } from '../common/dto/prompt-response.dto';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('prompts')
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get('shared/:token')
  @ApiOperation({ summary: 'Get a public prompt by share token' })
  @ApiResponse({ status: 200, type: PromptResponseDto })
  async findByShareToken(@Param('token') token: string): Promise<PromptResponseDto> {
    const prompt = await this.promptsService.findByShareToken(token);
    return PromptResponseDto.fromPrisma(prompt);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new prompt' })
  @ApiResponse({ status: 201, type: PromptResponseDto })
  async create(
    @Request() req: RequestWithUser,
    @Body() createPromptDto: CreatePromptDto,
  ): Promise<PromptResponseDto> {
    const prompt = await this.promptsService.create(req.user.id, createPromptDto);
    return PromptResponseDto.fromPrisma(prompt);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all prompts for current user' })
  @ApiResponse({ status: 200, type: [PromptResponseDto] })
  async findAll(@Request() req: RequestWithUser): Promise<PromptResponseDto[]> {
    const prompts = await this.promptsService.findAll(req.user.id);
    return prompts.map(PromptResponseDto.fromPrisma);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific prompt by ID' })
  @ApiResponse({ status: 200, type: PromptResponseDto })
  async findOne(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<PromptResponseDto> {
    const prompt = await this.promptsService.findOne(id, req.user.id);
    return PromptResponseDto.fromPrisma(prompt);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a prompt' })
  @ApiResponse({ status: 200, type: PromptResponseDto })
  async update(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() updatePromptDto: UpdatePromptDto,
  ): Promise<PromptResponseDto> {
    const prompt = await this.promptsService.update(id, req.user.id, updatePromptDto);
    return PromptResponseDto.fromPrisma(prompt);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a prompt' })
  async remove(@Param('id') id: string, @Request() req: RequestWithUser): Promise<void> {
    return this.promptsService.remove(id, req.user.id);
  }

  @Get(':id/versions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all versions of a prompt' })
  async getVersions(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<
    Array<{
      id: string;
      version: number;
      name: string;
      description: string | null;
      createdAt: Date;
    }>
  > {
    return this.promptsService.getVersions(id, req.user.id);
  }

  @Post(':id/versions/:versionId/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore a specific version of a prompt' })
  @ApiResponse({ status: 200, type: PromptResponseDto })
  async restoreVersion(
    @Param('id') id: string,
    @Param('versionId') versionId: string,
    @Request() req: RequestWithUser,
  ): Promise<PromptResponseDto> {
    const prompt = await this.promptsService.restoreVersion(id, versionId, req.user.id);
    return PromptResponseDto.fromPrisma(prompt);
  }

  @Get(':id/export/markdown')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export prompt as markdown' })
  async exportMarkdown(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<{ markdown: string }> {
    const markdown = await this.promptsService.exportToMarkdown(id, req.user.id);
    return { markdown };
  }
}
