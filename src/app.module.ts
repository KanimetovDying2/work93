import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArtistsModule } from './artists/artists.module.js';
import { AlbumsModule } from './albums/albums.module.js';
import { TracksModule } from './tracks/tracks.module.js';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/work93api'),
    ArtistsModule,
    AlbumsModule,
    TracksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
