import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://guest:guest@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
        ],
        queue: 'itineraries-notifications-queue',
        queueOptions: {
          durable: true,
        },
        prefetchCount: 1,
      },
    },
  );
  app.listen();
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3001);
}
bootstrap();
