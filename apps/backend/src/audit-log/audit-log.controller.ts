import { Controller, Get, Query, UseGuards, Request, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { User, AuditLog } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditLogService } from './audit-log.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of audit logs' })
  async findAll(
    @Request() req: RequestWithUser,
    @Query() query: QueryAuditLogDto,
  ): Promise<AuditLog[]> {
    return this.auditLogService.findAll(req.user.id, query);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get count of audit logs for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Count of audit logs' })
  async count(
    @Request() req: RequestWithUser,
    @Query() query: QueryAuditLogDto,
  ): Promise<{ count: number }> {
    const count = await this.auditLogService.count(req.user.id, query);
    return { count };
  }

  @Get('entity/:entityId')
  @ApiOperation({ summary: 'Get audit logs for a specific entity' })
  @ApiResponse({ status: 200, description: 'List of audit logs for the entity' })
  async findByEntity(@Param('entityId') entityId: string): Promise<AuditLog[]> {
    return this.auditLogService.findByEntity(entityId);
  }
}
