import { Body, Controller, Post, HttpException, HttpStatus, Get, Param, HttpCode } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from 'src/shared/models/user.model';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() user: User): Promise<void> {
    if (!user.email || !user.password) {
      throw new HttpException({ message: 'Invalid user' }, HttpStatus.BAD_REQUEST);
    }

    const userFromEmail = await this.userService.findFromEmail(user.email);
    if (userFromEmail) {
      throw new HttpException({ message: 'Email already used' }, HttpStatus.CONFLICT);
    }

    try {
      await this.userService.create(user);
    } catch (error) {
      throw new HttpException({ message: 'Failed to save user' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async find(@Param('id') id: string): Promise<User> {
    try {
      return await this.userService.find(id);
    } catch (error) {
      throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
    }
  }

  // @Post('/check/pseudo')
  // @HttpCode(200)
  // async validPseudonyme(@Body() user: User): Promise<any> {
  //   if (!user.pseudo) {
  //     throw new HttpException({ message: 'Invalid pseudonyme' }, HttpStatus.BAD_REQUEST);
  //   }

  //   const userFromPseudo = await this.userService.findFromPseudonyme(user.pseudo);
  //   if (userFromPseudo) {
  //     throw new HttpException({ message: `Pseudonyme ${user.pseudo} already exists.` }, HttpStatus.CONFLICT);
  //   }

  //   return { message: 'Pseudonyme is valid' };
  // }
}