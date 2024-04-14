import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'bonjour herve kilanda actuellement tu apprend nestJs';
  }
}
