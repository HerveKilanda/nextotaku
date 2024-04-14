import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpruntDto } from './create-emprunt.dto';

export class UpdateEmpruntDto extends PartialType(CreateEmpruntDto) {}
