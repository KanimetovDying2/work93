import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from './schemas/track.schema.js';
import { CreateTrackDto } from './dto/create.tracks.dto.js';
import { TokenAuthGuard } from '../users/guards/token-auth.guard.js';

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

  @UseGuards(TokenAuthGuard)
  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    const track = new this.trackModel(createTrackDto);
    return track.save();
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Access denied. Only admin can delete.');
    }

    const result = await this.trackModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Track not found');
    return { message: 'Track deleted successfully', id };
  }
}
