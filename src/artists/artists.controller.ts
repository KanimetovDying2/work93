import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Artist, ArtistDocument } from './schemas/artist.schema.js';
import { CreateArtistDto } from './dto/create.artist.dto.js';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const artist = await this.artistModel.findById(id);
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/artists',
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
    @Body() createArtistDto: CreateArtistDto,
  ) {
    const artist = new this.artistModel({
      ...createArtistDto,
      image: file ? `/uploads/artists/${file.filename}` : null,
    });
    return artist.save();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.artistModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Artist not found');
    return { message: 'Artist deleted successfully', id };
  }
}
