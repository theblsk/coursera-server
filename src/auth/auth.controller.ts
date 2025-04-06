import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto as SignInUserDto } from './dto/signin-user.dto';
import { Public } from './decorators/public.decorator';
import { LoginResponseDto as SignInResponseDto } from './dto/signin-response.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import 'express';

@Controller('user')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user.toObject();
    return result;
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() signInUserDto: SignInUserDto,
  ): Promise<SignInResponseDto> {
    const user = await this.authService.validateUser(
      signInUserDto.email,
      signInUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user) as SignInResponseDto;
  }

  @ApiBearerAuth()
  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Request() req: Express.Request) {
    const userPayload = req.user as JwtPayload;
    if (!userPayload) {
      throw new UnauthorizedException('User payload not found on request');
    }
    const userId = userPayload.sub;
    const updatedUser = await this.usersService.subscribeUser(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser.toObject();
    return result;
  }
}
