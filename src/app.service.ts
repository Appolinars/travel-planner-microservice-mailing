// import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class AppService {
  private limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 500, // minimum time between calls in milliseconds
  });

  constructor(private readonly mailerService: MailerService) {}

  async handleEmailNotification(msg: {
    userId: number;
    email: string;
    username: string;
    itineraryId: number;
    itineraryTitle: string;
    startDate: Date;
  }): Promise<void> {
    await this.limiter.schedule(() => this.sendEmail(msg));
  }

  private async sendEmail(msg: {
    userId: number;
    email: string;
    username: string;
    itineraryId: number;
    itineraryTitle: string;
    startDate: Date;
  }): Promise<void> {
    const { email, itineraryTitle, itineraryId } = msg;

    await delay(300);
    console.log(
      `Email sent to ${email} for itinerary ${itineraryTitle} (${itineraryId})`,
    );

    // await this.mailerService.sendMail({
    //   from: '"Travel App" <your-email@example.com>',
    //   to: email,
    //   subject: `Reminder: Your Itinerary "${itineraryTitle}" Starts Soon!`,
    //   text: `Hi ${username},\n\nYour itinerary "${itineraryTitle}" starts on ${new Date(startDate).toDateString()}.`,
    // });
  }

  // @RabbitSubscribe({
  //   exchange: 'itinerary_notifications',
  //   routingKey: 'email',
  //   queue: 'email_notifications',
  // })
  // async handleEmailNotification(msg: {
  //   userId: number;
  //   email: string;
  //   username: string;
  //   itineraryId: number;
  //   itineraryTitle: string;
  //   startDate: Date;
  // }) {
  //   const { email, itineraryTitle } = msg;
  //   await this.rateLimiter.consume(email);

  //   console.log(`Email sent to ${email} for itinerary ${itineraryTitle}`);

  //   // await this.mailerService.sendMail({
  //   //   from: '"Travel App" <vakulenko.maksim977@gmail.com>',
  //   //   to: email,
  //   //   subject: `Reminder: Your Itinerary "${itineraryTitle}" Starts Soon!`,
  //   //   text: `Hi ${username},\n\nYour itinerary "${itineraryTitle}" starts on ${new Date(startDate).toDateString()}.`,
  //   // });
  // }
}
