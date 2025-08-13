import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from './firebase.service.js';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private fb: FirebaseService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] || '';
    if (!authHeader.startsWith('Bearer ')) throw new UnauthorizedException('Missing bearer token');
    const idToken = authHeader.substring('Bearer '.length);
    try {
      const decoded = await this.fb.auth().verifyIdToken(idToken);
      req.user = decoded; // uid, email, etc.
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
