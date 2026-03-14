import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'OK',
      message: 'Smart Mom API is running',
      timestamp: new Date().toISOString(),
    };
  }
}