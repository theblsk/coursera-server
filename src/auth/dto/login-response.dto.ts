// import { ApiProperty } from '@nestjs/swagger'; // Optional: for Swagger documentation
import { Types } from 'mongoose';

// Define the structure for the user part of the response
class LoginUserResponse {
  // @ApiProperty()
  _id: Types.ObjectId;

  // @ApiProperty()
  email: string;

  // @ApiProperty()
  firstName?: string;

  // @ApiProperty()
  lastName?: string;

  // Add other fields returned by validateUser (excluding password) as needed
}

export class LoginResponseDto {
  // @ApiProperty()
  access_token: string;

  // @ApiProperty({ type: LoginUserResponse })
  user: LoginUserResponse;
}
