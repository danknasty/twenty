import { Injectable } from '@nestjs/common';

@Injectable()
export class OffLimitsGuardService {
  async check(): Promise<{ status: 'CLEAR' }> {
    return { status: 'CLEAR' };
  }
}
