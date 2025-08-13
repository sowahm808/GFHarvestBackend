import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller.js';
import { LeadsService } from './leads.service.js';
import { FirebaseService } from '../auth/firebase.service.js';

@Module({ controllers: [LeadsController], providers: [LeadsService, FirebaseService] })
export class LeadsModule {}
