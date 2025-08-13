import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard.js';
import { IsOptional, IsString, IsUrl } from 'class-validator';

class CreateProposalDto {
  @IsString() dealId!: string;
  @IsString() title!: string;
  @IsOptional() @IsUrl() docUrl?: string;
}

class SendProposalDto { @IsString() proposalId!: string; @IsString() recipientEmail!: string; }

@Controller('proposals')
@UseGuards(FirebaseAuthGuard)
export class ProposalsController {
  constructor(private prisma: PrismaService) {}
  private accountId(req: any){ return req.headers['x-account-id'] || 'demo'; }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateProposalDto){
    return this.prisma.proposal.create({ data: { accountId: this.accountId(req), dealId: dto.dealId, title: dto.title, docUrl: dto.docUrl, status: 'DRAFT' } });
  }

  @Post('send')
  async send(@Req() req: any, @Body() dto: SendProposalDto){
    // TODO: integrate DocuSign. For now, mark as SENT and set sentAt.
    const p = await this.prisma.proposal.update({ where: { id: dto.proposalId }, data: { status: 'SENT', sentAt: new Date() } });
    // You can enqueue email send here.
    return { ok: true, proposal: p };
  }
}
