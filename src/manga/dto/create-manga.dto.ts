import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMangaDto {
  
  @IsNotEmpty()
 readonly titre: string;

  @IsString()
   readonly description: string;


  readonly userId: number;

  readonly categorieId: number;
}
