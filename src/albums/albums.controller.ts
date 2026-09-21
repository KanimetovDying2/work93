import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Album, AlbumDocument } from './schemas/album.schema.js';
import { CreateAlbumDto } from './dto/create.album.dto.js';
import { TokenAuthGuard } from '../users/guards/token-auth.guard.js';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAll(@Query('artist') artistId: string) {
    const filter = artistId ? { artist: artistId } : {};
    return this.albumModel.find(filter).populate('artist');
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById(id).populate('artist');
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/albums',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      ...createAlbumDto,
      image: file ? `/uploads/albums/${file.filename}` : null,
    });
    return album.save();
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Access denied. Only admin can delete.');
    }

    const result = await this.albumModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Album not found');
    return { message: 'Album deleted successfully', id };
  }
}
