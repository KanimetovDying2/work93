import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TracksController } from './tracks.controller.js';
import { Track, TrackSchema } from './schemas/track.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
  ],
  controllers: [TracksController],
})
export class TracksModule {}
