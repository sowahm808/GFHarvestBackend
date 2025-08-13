import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private app: admin.app.App;
  constructor(){
    if (!admin.apps.length) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        this.app = admin.initializeApp({ credential: admin.credential.cert(svc) });
      } else {
        this.app = admin.initializeApp({ credential: admin.credential.applicationDefault() });
      }
    } else {
      this.app = admin.app();
    }
  }

  auth(){ return this.app.auth(); }
}
