import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller.js';
import { FirebaseService } from '../auth/firebase.service.js';

@Module({ controllers: [ProposalsController], providers: [FirebaseService] })
export class ProposalsModule {}
