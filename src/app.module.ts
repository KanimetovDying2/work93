import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArtistsModule } from './artists/artists.module.js';

@Module({
  imports: [ArtistsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
