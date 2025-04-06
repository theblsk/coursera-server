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

@ApiBearerAuth()
@Controller('courses')
@UseGuards(SubscriptionGuard)
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get('user')
  async findUserCourses(@Request() req: Express.Request) {
    const userPayload = req.user as JwtPayload;
    if (!userPayload) throw new UnauthorizedException();
    const userId = userPayload.sub;
    const userWithCourses = await this.usersService.findUserWithCourses(userId);
    return userWithCourses ? userWithCourses.courses : [];
  }

  @Post('add')
  async addCourseToUser(
    @Request() req: Express.Request,
    @Body('courseId') courseId: string,
  ) {
    const userPayload = req.user as JwtPayload;
    if (!userPayload) throw new UnauthorizedException();
    const userId = userPayload.sub;
    const updatedUser = await this.usersService.addCourseToUser(
      userId,
      courseId,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser.toObject();
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto);
  }
}
