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
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('user')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    this.logger.info(
      `Signup request received for email: ${createUserDto.email}`,
    );
    const user = await this.authService.signup(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user.toObject();
    this.logger.info(`User signup completed successfully`);
    return result;
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() signInUserDto: SignInUserDto,
  ): Promise<SignInResponseDto> {
    this.logger.info(
      `Signin request received for email: ${signInUserDto.email}`,
    );
    const user = await this.authService.validateUser(
      signInUserDto.email,
      signInUserDto.password,
    );
    if (!user) {
      this.logger.warn(`Signin failed for email: ${signInUserDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    this.logger.info(`Signin successful for user: ${user.email}`);
    return this.authService.login(user) as SignInResponseDto;
  }

  @ApiBearerAuth()
  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Request() req: Express.Request) {
    const userPayload = req.user as JwtPayload;
    if (!userPayload) {
      this.logger.error(
        'Subscribe request failed - User payload not found on request',
      );
      throw new UnauthorizedException('User payload not found on request');
    }
    const userId = userPayload.sub;
    this.logger.info(`Subscribe request received for user ID: ${userId}`);
    const updatedUser = await this.usersService.subscribeUser(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser.toObject();
    this.logger.info(`User ${userId} subscribed successfully`);
    return result;
  }
}
