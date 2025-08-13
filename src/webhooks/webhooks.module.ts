import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe.webhook.controller.js';

@Module({ controllers: [StripeWebhookController] })
export class WebhooksModule {}
