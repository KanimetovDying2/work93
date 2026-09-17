import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
  controllers: [ArtistsController],
})
export class ArtistsModule {}
