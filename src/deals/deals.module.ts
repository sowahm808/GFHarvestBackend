import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller.js';
import { DealsService } from './deals.service.js';
import { FirebaseService } from '../auth/firebase.service.js';

@Module({ controllers: [DealsController], providers: [DealsService, FirebaseService] })
export class DealsModule {}
