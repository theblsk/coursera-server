import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async findAll(): Promise<Course[]> {
    this.logger.info('Retrieving all courses');
    const courses = await this.courseModel.find().exec();
    this.logger.info(`Retrieved ${courses.length} courses`);
    return courses;
  }

  async findOne(id: string): Promise<Course> {
    this.logger.info(`Finding course with ID: ${id}`);
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      this.logger.error(`Course not found with ID: ${id}`);
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    this.logger.info(`Found course: ${course.name}`);
    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    this.logger.info(`Creating new course: ${createCourseDto.name}`);
    const newCourse = new this.courseModel(createCourseDto);
    const savedCourse = await newCourse.save();
    this.logger.info(`Course created successfully`);
    return savedCourse;
  }
}
