import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly usersService: UsersService,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async upgradeToPro(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isPro = true;
    await this.usersService.update(userId, { isPro: true });

    // Add a job to the queue
    await this.notificationsQueue.add(
      'send',
      {
        channel: `user_${userId}_notifications`, // Assuming a channel based on userId
        message: 'Congratulations! You have successfully upgraded to Pro status. You now have write access to all APIs.',
      },
      {
        attempts: 3, // Retry up to 3 times
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    return { message: 'Successfully upgraded to Pro', user };
  }
}
