import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface ValidatedUserPayload {
  _id: Types.ObjectId;
  email: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  courses?: Types.ObjectId[];
  subscribed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<ValidatedUserPayload | null> {
    this.logger.info(`Attempting to validate user with email: ${email}`);
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await user.comparePassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      this.logger.info(`User ${email} authenticated successfully`);
      return result as ValidatedUserPayload;
    }
    this.logger.warn(`Authentication failed for user ${email}`);
    return null;
  }

  // Removed async as jwtService.sign is synchronous
  login(user: ValidatedUserPayload) {
    this.logger.info(`Generating JWT token for user: ${user.email}`);
    const payload = { email: user.email, sub: user._id.toHexString() };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.info(
      `Attempting to sign up user with email: ${createUserDto.email}`,
    );
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      this.logger.warn(
        `Signup failed - Email already exists: ${createUserDto.email}`,
      );
      throw new ConflictException('Email already exists');
    }
    const newUser = await this.usersService.create(createUserDto);
    this.logger.info(
      `User signed up successfully with email: ${createUserDto.email}`,
    );
    return newUser;
  }
}
