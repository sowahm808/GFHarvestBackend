import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { CreateDealDto, UpdateDealDto } from './dto.js';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  list(accountId: string){ return this.prisma.deal.findMany({ where: { accountId }, orderBy: { createdAt: 'desc' } }); }
  get(accountId: string, id: string){ return this.prisma.deal.findFirst({ where: { id, accountId } }); }

  create(accountId: string, ownerId: string | undefined, dto: CreateDealDto){
    return this.prisma.deal.create({ data: { accountId, ownerId, stage: 'DISCOVERY', ...dto } });
  }

  update(accountId: string, id: string, dto: UpdateDealDto){ return this.prisma.deal.update({ where: { id }, data: dto }); }
}
