import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller.js';

@Module({
  controllers: [ArtistsController]
})
export class ArtistsModule {}
