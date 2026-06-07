// import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface EmailNotification {
  correlationId?: string;
  userId: number;
  email: string;
  username: string;
  itineraryId: number;
  itineraryTitle: string;
  startDate: Date;
}

@Injectable()
export class AppService {
  private limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 500, // minimum time between calls in milliseconds
  });

  constructor(
    private readonly mailerService: MailerService,
    @InjectPinoLogger(AppService.name)
    private readonly logger: PinoLogger,
  ) {}

  async handleEmailNotification(msg: EmailNotification): Promise<void> {
    await this.limiter.schedule(() => this.sendEmail(msg));
  }

  private async sendEmail(msg: EmailNotification): Promise<void> {
    const { correlationId, email, itineraryTitle, itineraryId } = msg;

    await delay(300);
    // correlationId ties this back to the API log line that published it.
    this.logger.info(
      { correlationId, email, itineraryId, itineraryTitle },
      'Email sent (stub)',
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
