import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('itinerary_start_reminder')
  async handleOrderPlaced(
    @Payload()
    payload: {
      userId: number;
      email: string;
      username: string;
      itineraryId: number;
      itineraryTitle: string;
      startDate: Date;
    },
  ) {
    await this.appService.handleEmailNotification(payload);
  }
}
