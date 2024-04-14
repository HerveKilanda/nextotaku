import { PartialType } from '@nestjs/mapped-types';
import { inscriptionDto } from './inscription';


export class UpdateAuthentificationDto extends PartialType(
inscriptionDto
) {}
