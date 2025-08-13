import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../common/prisma.service.js';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Req() req: any, @Body() body: any, @Headers('stripe-signature') sig: string){
    const secret = process.env.STRIPE_WEBHOOK_SECRET as string;
    let event: Stripe.Event;
    try {
      const buf = Buffer.isBuffer(req.rawBody) ? req.rawBody : Buffer.from(JSON.stringify(body));
      event = this.stripe.webhooks.constructEvent(buf, sig!, secret);
    } catch (err) {
      return { error: 'Invalid signature' };
    }

    switch(event.type){
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const pi = session.payment_intent as string;
        await this.prisma.payment.updateMany({ where: { stripePaymentIntentId: pi }, data: { status: 'SUCCEEDED' } });
        break;
      }
    }
    return { received: true };
  }
}
