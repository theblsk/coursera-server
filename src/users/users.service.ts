import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async subscribeUser(userId: string): Promise<UserDocument> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.subscribed = true;
    return user.save();
  }

  async addCourseToUser(
    userId: string,
    courseId: string,
  ): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new NotFoundException(`Course ID ${courseId} is invalid`);
    }

    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.courses.some((id) => id.equals(courseId))) {
      user.courses.push(new Types.ObjectId(courseId));
      await user.save();
    }
    return user;
  }

  async findUserWithCourses(userId: string): Promise<UserDocument | null> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.userModel.findById(userId).populate('courses').exec();
  }
}
