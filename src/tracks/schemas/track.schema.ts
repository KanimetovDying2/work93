import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Album } from '../../albums/schemas/album.schema.js';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Album.name, required: true })
  album: Types.ObjectId;

  @Prop({ required: true })
  duration: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
