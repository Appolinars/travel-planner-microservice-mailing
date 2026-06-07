import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      bufferLogs: true,
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASSWORD || 'guest'}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
        ],
        queue: 'itineraries-notifications-queue',
        queueOptions: {
          durable: true,
        },
        prefetchCount: 1,
      },
    },
  );
  app.useLogger(app.get(Logger));
  app.listen();
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3001);
}
bootstrap();
