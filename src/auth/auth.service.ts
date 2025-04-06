import {
  Injectable,
  // UnauthorizedException, // Removed as unused in this service
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
// import { LoginUserDto } from './dto/login-user.dto'; // Removed unused import
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose'; // Import Types

// Define an interface for the validated user payload (excluding password)
interface ValidatedUserPayload {
  _id: Types.ObjectId; // Changed to Types.ObjectId
  email: string;
  // Include other non-sensitive fields returned by validateUser
  firstName?: string;
  lastName?: string;
  age?: number;
  courses?: Types.ObjectId[]; // Also ensure this matches if populated
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
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<ValidatedUserPayload | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await user.comparePassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result as ValidatedUserPayload; // Cast should work now
    }
    return null;
  }

  // Removed async as jwtService.sign is synchronous
  login(user: ValidatedUserPayload) {
    const payload = { email: user.email, sub: user._id.toHexString() }; // Convert ObjectId to string for JWT payload
    return {
      access_token: this.jwtService.sign(payload),
      user, // user is now typed
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    return this.usersService.create(createUserDto);
  }
}
