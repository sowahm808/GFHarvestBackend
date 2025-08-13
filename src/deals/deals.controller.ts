import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service.js';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard.js';
import { CreateDealDto, UpdateDealDto } from './dto.js';

@Controller('deals')
@UseGuards(FirebaseAuthGuard)
export class DealsController {
  constructor(private svc: DealsService) {}
  private accountId(req: any){ return req.headers['x-account-id'] || 'demo'; }
  private ownerId(req: any){ return req.user?.uid as string | undefined; }

  @Get() list(@Req() req: any){ return this.svc.list(this.accountId(req)); }
  @Get(':id') get(@Req() req: any, @Param('id') id: string){ return this.svc.get(this.accountId(req), id); }
  @Post() create(@Req() req: any, @Body() dto: CreateDealDto){ return this.svc.create(this.accountId(req), this.ownerId(req), dto); }
  @Patch(':id') update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateDealDto){ return this.svc.update(this.accountId(req), id, dto); }
}
