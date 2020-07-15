import { NestFactory } from '@nestjs/core';
import { startWithAppContext } from '../src/repl';
import { AppModule } from './app.module';

(async () => {
  const applicationContext = await NestFactory.createApplicationContext(
    AppModule,
  );
  startWithAppContext(applicationContext);
})();

/** or built-in:
  (async () => {
    await startWithAppModule(AppModule);
  })();
*/
