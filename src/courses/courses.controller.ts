import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './schemas/course.schema';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '../auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiBearerAuth()
@Controller('courses')
@UseGuards(SubscriptionGuard)
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  async findAll(): Promise<Course[]> {
    this.logger.info('Request to find all courses');
    const courses = await this.coursesService.findAll();
    this.logger.info(`Returning ${courses.length} courses to client`);
    return courses;
  }

  @Get('user')
  async findUserCourses(@Request() req: Express.Request) {
    const userPayload = req.user as JwtPayload;
    if (!userPayload) throw new UnauthorizedException();
    const userId = userPayload.sub;
    this.logger.info(`Request to find courses for user ID: ${userId}`);
    const userWithCourses = await this.usersService.findUserWithCourses(userId);
    const courses = userWithCourses ? userWithCourses.courses : [];
    this.logger.info(
      `Returning ${courses.length} courses for user ID: ${userId}`,
    );
    return courses;
  }

  @Post('add')
  async addCourseToUser(
    @Request() req: Express.Request,
    @Body('courseId') courseId: string,
  ) {
    const userPayload = req.user as JwtPayload;
    if (!userPayload) throw new UnauthorizedException();
    const userId = userPayload.sub;
    this.logger.info(`Request to add course ${courseId} to user ${userId}`);
    const updatedUser = await this.usersService.addCourseToUser(
      userId,
      courseId,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser.toObject();
    this.logger.info(`Successfully added course ${courseId} to user ${userId}`);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Course> {
    this.logger.info(`Request to find course with ID: ${id}`);
    const course = await this.coursesService.findOne(id);
    this.logger.info(`Returning course: ${course.name}`);
    return course;
  }

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    this.logger.info(`Request to create new course: ${createCourseDto.name}`);
    const course = await this.coursesService.create(createCourseDto);
    this.logger.info(`Created course`);
    return course;
  }
}
