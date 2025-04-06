import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

class LoginUserResponse {
  _id: Types.ObjectId;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;
}

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ type: LoginUserResponse })
  user: LoginUserResponse;
}
