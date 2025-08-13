import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service.js';

@Controller('auth')
export class AuthController {
  constructor(private fb: FirebaseService) {}

  @Post('verify')
  async verify(@Body('idToken') idToken: string){
    const decoded = await this.fb.auth().verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email, claims: decoded }; // echo core claims
  }
}
