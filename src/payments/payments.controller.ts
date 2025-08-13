import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service.js';
import { PrismaService } from '../common/prisma.service.js';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard.js';
import { IsInt, IsString, IsUrl, Min } from 'class-validator';

class CheckoutDto {
  @IsString() dealId!: string;
  @IsInt() @Min(100) amount!: number; // cents
  @IsUrl() successUrl!: string;
  @IsUrl() cancelUrl!: string;
}

@Controller('payments')
@UseGuards(FirebaseAuthGuard)
export class PaymentsController {
  constructor(private stripe: StripeService, private prisma: PrismaService) {}
  private accountId(req: any){ return req.headers['x-account-id'] || 'demo'; }

  @Post('checkout')
  async checkout(@Req() req: any, @Body() dto: CheckoutDto){
    const session = await this.stripe.createCheckout(dto.amount, dto.successUrl, dto.cancelUrl);
    // Optionally create a pending Payment record
    await this.prisma.payment.create({ data: { accountId: this.accountId(req), dealId: dto.dealId, stripePaymentIntentId: session.payment_intent as string, amount: dto.amount, status: 'PENDING' } });
    return { id: session.id, url: session.url };
  }
}
