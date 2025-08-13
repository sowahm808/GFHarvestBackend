import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service.js';
import { AuthModule } from './auth/auth.module.js';
import { LeadsModule } from './leads/leads.module.js';
import { DealsModule } from './deals/deals.module.js';
import { ProposalsModule } from './proposals/proposals.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { WebhooksModule } from './webhooks/webhooks.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, LeadsModule, DealsModule, ProposalsModule, PaymentsModule, WebhooksModule],
  providers: [PrismaService],
})
export class AppModule {}
