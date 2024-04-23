import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { UpdateEmpruntDto } from './dto/update-emprunt.dto';
import { EmpruntService } from './emprunt.service';
import { Emprunt } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('emprunt')
export class EmpruntController {
  constructor(private readonly empruntService: EmpruntService) {}

  @Post('creation')
  create(@Body() createEmpruntDto: CreateEmpruntDto) {
    return this.empruntService.create(createEmpruntDto);
  }

  @Get('all')
  async findAllEmprunt(userId: number, mangaId: number) {
    try {
      return await this.empruntService.findAllEmprunt(userId, mangaId);
    } catch (error) {
      // Handle the error here
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the manga list.',
      );
    }
  }

  @Put(':id')
  async updateEmprunt(
    @Param('id', ParseIntPipe) empruntsId: number,
    @Body() updateEmpruntDto: UpdateEmpruntDto,
  ) {
    return await this.empruntService.update(empruntsId, updateEmpruntDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') empruntsId: string) {
    return await this.empruntService.delete(Number(empruntsId));
  }

  // @Delete(':id')
  // async delete(@Param('id', ParseIntPipe) empruntsId: number) {
  //   try {
  //     await this.empruntService.delete(Number(empruntsId));
  //     return { message: "L'emprunt a été supprimé avec succès" };
  //   } catch (error) {
  //     console.error(error);
  //     throw new NotFoundException("L'emprunt n'a pas pu être supprimé");
  //   }
  // }
}

