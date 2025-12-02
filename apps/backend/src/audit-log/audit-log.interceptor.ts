import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from './audit-log.service';

export const AUDIT_LOG_KEY = 'audit-log';

export interface AuditLogMetadata {
  action: string;
  entity: string;
  getEntityId?: (result: any) => string;
  getChanges?: (result: any, request: any) => Record<string, any>;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = this.reflector.get<AuditLogMetadata>(AUDIT_LOG_KEY, context.getHandler());

    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((result) => {
        const entityId = metadata.getEntityId
          ? metadata.getEntityId(result)
          : result?.id || request.params?.id;

        const changes = metadata.getChanges ? metadata.getChanges(result, request) : undefined;

        if (entityId) {
          this.auditLogService
            .create({
              userId: user.id,
              action: metadata.action,
              entity: metadata.entity,
              entityId,
              changes,
            })
            .catch((error) => {
              console.error('Failed to create audit log:', error);
            });
        }
      }),
    );
  }
}
