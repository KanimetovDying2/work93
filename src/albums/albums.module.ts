import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumsController } from './albums.controller.js';
import { Album, AlbumSchema } from './schemas/album.schema.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    UsersModule,
  ],
  controllers: [AlbumsController],
})
export class AlbumsModule {}
