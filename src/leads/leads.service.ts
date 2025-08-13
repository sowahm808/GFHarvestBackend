import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { CreateLeadDto, UpdateLeadDto } from './dto.js';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  list(accountId: string){
    return this.prisma.lead.findMany({ where: { accountId }, orderBy: { createdAt: 'desc' } });
  }

  get(accountId: string, id: string){
    return this.prisma.lead.findFirst({ where: { id, accountId } });
  }

  async create(accountId: string, ownerId: string | undefined, dto: CreateLeadDto){
    return this.prisma.lead.create({ data: { accountId, ownerId, ...dto, tags: [] } });
  }

  async update(accountId: string, id: string, dto: UpdateLeadDto){
    return this.prisma.lead.update({ where: { id }, data: dto });
  }
}
