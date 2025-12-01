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
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { User, Prompt } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { PromptsService } from './prompts.service';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('prompts')
@Controller('prompts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prompt' })
  async create(
    @Request() req: RequestWithUser,
    @Body() createPromptDto: CreatePromptDto,
  ): Promise<Prompt> {
    return this.promptsService.create(req.user.id, createPromptDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prompts for current user' })
  async findAll(@Request() req: RequestWithUser): Promise<Prompt[]> {
    return this.promptsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific prompt by ID' })
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser): Promise<Prompt> {
    return this.promptsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a prompt' })
  async update(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() updatePromptDto: UpdatePromptDto,
  ): Promise<Prompt> {
    return this.promptsService.update(id, req.user.id, updatePromptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prompt' })
  async remove(@Param('id') id: string, @Request() req: RequestWithUser): Promise<void> {
    return this.promptsService.remove(id, req.user.id);
  }

  @Get(':id/versions')
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
  @ApiOperation({ summary: 'Restore a specific version of a prompt' })
  async restoreVersion(
    @Param('id') id: string,
    @Param('versionId') versionId: string,
    @Request() req: RequestWithUser,
  ): Promise<Prompt> {
    return this.promptsService.restoreVersion(id, versionId, req.user.id);
  }

  @Get(':id/export/markdown')
  @ApiOperation({ summary: 'Export prompt as markdown' })
  async exportMarkdown(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<{ markdown: string }> {
    const markdown = await this.promptsService.exportToMarkdown(id, req.user.id);
    return { markdown };
  }
}
