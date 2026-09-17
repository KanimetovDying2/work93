import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from './schemas/track.schema.js';
import { CreateTrackDto } from './dto/create.tracks.dto.js';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async getAll(@Query('album') albumId: string) {
    const filter = albumId ? { album: albumId } : {};
    return this.trackModel.find(filter).populate({
      path: 'album',
      populate: { path: 'artist' },
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const track = await this.trackModel.findById(id).populate({
      path: 'album',
      populate: { path: 'artist' },
    });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    const track = new this.trackModel(createTrackDto);
    return track.save();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.trackModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Track not found');
    return { message: 'Track deleted successfully', id };
  }
}
