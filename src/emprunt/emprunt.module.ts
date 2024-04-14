import { Module } from '@nestjs/common';
import { EmpruntService } from './emprunt.service';
import { EmpruntController } from './emprunt.controller';

@Module({
  controllers: [EmpruntController],
  providers: [EmpruntService],
})
export class EmpruntModule {}
