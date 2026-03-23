import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  async upgradeToPro(@Request() req) {
    // req.user contains the authenticated user details from JWT
    return this.subscriptionService.upgradeToPro(req.user.id);
  }
}
