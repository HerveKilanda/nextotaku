import { Injectable } from '@nestjs/common';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { UpdateEmpruntDto } from './dto/update-emprunt.dto';

@Injectable()
export class EmpruntService {
  create(createEmpruntDto: CreateEmpruntDto) {
    return 'This action adds a new emprunt';
  }

  findAll() {
    return `This action returns all emprunt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emprunt`;
  }

  update(id: number, updateEmpruntDto: UpdateEmpruntDto) {
    return `This action updates a #${id} emprunt`;
  }

  remove(id: number) {
    return `This action removes a #${id} emprunt`;
  }
}
