import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/authentification/role.decorateur';
import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/authentification/guards';
@ApiBearerAuth()
@ApiTags('categorie')
@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Roles(Role.ADMIN) // Décorateur pour spécifier les rôles autorisés
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post('create')
  async create(@Body() createCategorieDto: CreateCategorieDto) {
    return await this.categorieService.create(createCategorieDto);
  }

  @Get('all')
  async findAll() {
    return await this.categorieService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categorieService.findOne(+id);
  }

  @Roles(Role.ADMIN) // Décorateur pour spécifier les rôles autorisés
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategorieDto: UpdateCategorieDto,
  ) {
    return this.categorieService.update(+id, updateCategorieDto);
  }

  @Roles(Role.ADMIN) // Décorateur pour spécifier les rôles autorisés
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.categorieService.remove(+id);
  }
}
