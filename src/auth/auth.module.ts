import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service.js';
import { AuthController } from './auth.controller.js';

@Module({
  providers: [FirebaseService],
  controllers: [AuthController],
  exports: [FirebaseService],
})
export class AuthModule {}
