import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

  async createCheckout(amountCents: number, successUrl: string, cancelUrl: string){
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [{ price_data: { currency: 'usd', product_data: { name: 'High‑Ticket Deposit' }, unit_amount: amountCents }, quantity: 1 }],
    });
    return session;
  }
}
