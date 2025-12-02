import { Injectable } from '@nestjs/common';
import { Prisma, AuditLog } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

export interface CreateAuditLogParams {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, any>;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateAuditLogParams): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        changes: params.changes as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async findAll(userId: string, query: QueryAuditLogDto): Promise<AuditLog[]> {
    const where: Prisma.AuditLogWhereInput = {
      userId,
    };

    if (query.entity) {
      where.entity = query.entity;
    }

    if (query.entityId) {
      where.entityId = query.entityId;
    }

    if (query.action) {
      where.action = query.action;
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByEntity(entityId: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { entityId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async count(userId: string, query: QueryAuditLogDto): Promise<number> {
    const where: Prisma.AuditLogWhereInput = {
      userId,
    };

    if (query.entity) {
      where.entity = query.entity;
    }

    if (query.entityId) {
      where.entityId = query.entityId;
    }

    if (query.action) {
      where.action = query.action;
    }

    return this.prisma.auditLog.count({ where });
  }
}
