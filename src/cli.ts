import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { SeederModule } from './database/seeder/seeder.module';
import { SeedCommand } from './database/seeder/seed.command';

async function bootstrap() {
  await CommandFactory.run(
    {
      module: SeederModule,
      imports: [AppModule, SeederModule],
      providers: [SeedCommand],
    },
    ['warn'],
  );
}

bootstrap();
