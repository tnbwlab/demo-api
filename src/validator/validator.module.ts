import { Module } from '@nestjs/common';
import { UniqueEmailValidator } from './user.validator';

@Module({
  providers: [UniqueEmailValidator],
})
export class ValidatorModule {}
