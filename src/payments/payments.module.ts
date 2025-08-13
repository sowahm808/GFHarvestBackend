import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller.js';
import { StripeService } from './stripe.service.js';

@Module({ controllers: [PaymentsController], providers: [StripeService] })
export class PaymentsModule {}
