import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async findOneById(id: string): Promise<UserDocument | null> {
    this.logger.info(`Finding user by ID: ${id}`);
    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`Invalid user ID format: ${id}`);
      return null;
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.warn(`User not found with ID: ${id}`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    this.logger.info(`Finding user by email: ${email}`);
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.info(`Creating new user with email: ${createUserDto.email}`);
    const newUser = new this.userModel(createUserDto);
    const savedUser = await newUser.save();
    this.logger.info(`User created successfully`);
    return savedUser;
  }

  async subscribeUser(userId: string): Promise<UserDocument> {
    this.logger.info(`Subscribing user with ID: ${userId}`);
    const user = await this.findOneById(userId);
    if (!user) {
      this.logger.error(
        `Failed to subscribe - User not found with ID: ${userId}`,
      );
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.subscribed = true;
    const savedUser = await user.save();
    this.logger.info(`User ${userId} subscribed successfully`);
    return savedUser;
  }

  async addCourseToUser(
    userId: string,
    courseId: string,
  ): Promise<UserDocument> {
    this.logger.info(`Adding course ${courseId} to user ${userId}`);
    if (!Types.ObjectId.isValid(courseId)) {
      this.logger.error(`Invalid course ID format: ${courseId}`);
      throw new NotFoundException(`Course ID ${courseId} is invalid`);
    }

    const user = await this.findOneById(userId);
    if (!user) {
      this.logger.error(
        `Failed to add course - User not found with ID: ${userId}`,
      );
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.courses.some((id) => id.equals(courseId))) {
      this.logger.info(
        `Course ${courseId} not already in user's courses, adding it`,
      );
      user.courses.push(new Types.ObjectId(courseId));
      await user.save();
      this.logger.info(
        `Course ${courseId} added to user ${userId} successfully`,
      );
    } else {
      this.logger.info(`Course ${courseId} already exists in user's courses`);
    }
    return user;
  }

  async findUserWithCourses(userId: string): Promise<UserDocument | null> {
    this.logger.info(`Finding user with courses for user ID: ${userId}`);
    const user = await this.findOneById(userId);
    if (!user) {
      this.logger.error(
        `Failed to find user with courses - User not found with ID: ${userId}`,
      );
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const populatedUser = await this.userModel
      .findById(userId)
      .populate('courses')
      .exec();
    this.logger.info(
      `Retrieved user ${userId} with ${populatedUser?.courses.length} courses`,
    );
    return populatedUser;
  }
}
