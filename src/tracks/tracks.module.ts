import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TracksController } from './tracks.controller.js';
import { Track, TrackSchema } from './schemas/track.schema.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    UsersModule,
  ],
  controllers: [TracksController],
})
export class TracksModule {}
