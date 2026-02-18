import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello this is a test for the NestJS framework for the Makeda project!';
  }
}
