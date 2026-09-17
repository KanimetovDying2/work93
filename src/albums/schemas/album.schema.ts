import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Artist } from '../../artists/schemas/artist.schema.js';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Artist.name, required: true })
  artist: Types.ObjectId;

  @Prop({ required: true })
  year: number;

  @Prop()
  image: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
