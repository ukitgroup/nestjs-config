import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<AppConfig>(AppConfig);
  app.getHttpServer().setTimeout(config.httpTimeout);
  await app.listen(config.httpPort);

  // eslint-disable-next-line no-console
  console.debug(`Start server on http://localhost:${config.httpPort}`);
}
bootstrap();
