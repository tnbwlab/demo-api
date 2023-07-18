import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { UniqueEmailValidator } from 'src/validator/user.validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @Validate(UniqueEmailValidator, { message: 'Email Already Exists' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
