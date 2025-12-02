import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { PromptsModule } from './prompts/prompts.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PromptsModule,
    HealthModule,
    AuditLogModule,
  ],
})
export class AppModule {}
