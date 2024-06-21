import { Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotStatus } from '@prisma/client';

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    const event = await this.prismaService.event.findFirst({
      where: {
        id: createSpotDto.eventId,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.available,
      },
    });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: {
        eventId,
      },
    });
  }

  findOne(eventId: string, spotId: string) {
    return this.prismaService.spot.findFirst({
      where: {
        id: spotId,
        eventId,
      },
    });
  }

  async update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    const spot = await this.prismaService.spot.findFirst({
      where: {
        id: spotId,
        eventId: eventId,
      },
    });

    if (!spot) {
      throw new Error('Spot not found');
    }

    return this.prismaService.spot.update({
      where: {
        id: spotId,
      },
      data: updateSpotDto,
    });
  }

  async remove(eventId: string, spotId: string) {
    const spot = await this.prismaService.spot.findFirst({
      where: {
        id: spotId,
        eventId: eventId,
      },
    });

    if (!spot) {
      throw new Error('Spot not found');
    }

    return this.prismaService.spot.delete({
      where: {
        id: spotId,
      },
    });
  }
}
