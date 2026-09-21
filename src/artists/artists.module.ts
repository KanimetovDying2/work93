import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistsController } from './artists.controller.js';
import { Artist, ArtistSchema } from './schemas/artist.schema.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    UsersModule,
  ],
  controllers: [ArtistsController],
})
export class ArtistsModule {}
