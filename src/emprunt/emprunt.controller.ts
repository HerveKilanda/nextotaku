import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpruntService } from './emprunt.service';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { UpdateEmpruntDto } from './dto/update-emprunt.dto';

@Controller('emprunt')
export class EmpruntController {
  constructor(private readonly empruntService: EmpruntService) {}

  @Post()
  create(@Body() createEmpruntDto: CreateEmpruntDto) {
    return this.empruntService.create(createEmpruntDto);
  }

  @Get()
  findAll() {
    return this.empruntService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empruntService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpruntDto: UpdateEmpruntDto) {
    return this.empruntService.update(+id, updateEmpruntDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empruntService.remove(+id);
  }
}
