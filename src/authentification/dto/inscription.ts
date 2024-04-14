import { IsEmail, IsNotEmpty } from 'class-validator';
export class inscriptionDto {
  @IsNotEmpty()
 readonly username: string;
  @IsNotEmpty()
  @IsEmail()
 readonly email: string;
  @IsNotEmpty()
 readonly password: string;
}
