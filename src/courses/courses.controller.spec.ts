import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { UsersService } from '../users/users.service';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';
import { CreateCourseDto } from './dto/create-course.dto';
import { Types } from 'mongoose';
import { JwtPayload } from '../auth/guards/auth.guard';
import { UserDocument } from '../users/schemas/user.schema';

// Mock data and types
const mockUserId = new Types.ObjectId().toHexString();
const mockCourseId = new Types.ObjectId();
const mockCourse = {
  _id: mockCourseId,
  name: 'Test Course',
  description: 'Test Description',
  // Add other necessary fields matching the Course schema if needed
};
const mockUser = {
  _id: mockUserId,
  email: 'test@example.com',
  subscribed: true,
  courses: [mockCourseId],
  // Add other necessary fields matching the User schema if needed
};

const mockRequest = {
  user: {
    sub: mockUserId,
    email: 'test@example.com',
    // Add other fields if needed by tests
  } as JwtPayload,
} as Express.Request;

// Mock Services
const mockCoursesService = {
  findAll: jest.fn().mockResolvedValue([mockCourse]),
  findOne: jest.fn().mockResolvedValue(mockCourse),
  create: jest.fn().mockResolvedValue(mockCourse),
};

const mockUsersService = {
  findUserWithCourses: jest.fn().mockResolvedValue(mockUser),
  addCourseToUser: jest.fn().mockResolvedValue(mockUser),
};

// Mock Guard (allow access by default)
const mockSubscriptionGuard = { canActivate: jest.fn(() => true) };

// Define a type for the user object without password
type UserWithoutPassword = Omit<typeof mockUser, 'password'>;

describe('CoursesController', () => {
  let controller: CoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      // Override the guard used by the controller
      .overrideGuard(SubscriptionGuard)
      .useValue(mockSubscriptionGuard)
      .compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockCourse]);
      expect(mockCoursesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findUserCourses', () => {
    it('should return courses for the logged-in user', async () => {
      const result = await controller.findUserCourses(mockRequest);
      expect(result).toEqual(mockUser.courses);
      expect(mockUsersService.findUserWithCourses).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should return an empty array if user not found', async () => {
      jest
        .spyOn(mockUsersService, 'findUserWithCourses')
        .mockResolvedValueOnce(null);
      const result = await controller.findUserCourses(mockRequest);
      expect(result).toEqual([]);
      expect(mockUsersService.findUserWithCourses).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('addCourseToUser', () => {
    it('should add a course to the user and return the updated user', async () => {
      const courseIdToAdd = new Types.ObjectId().toHexString();
      const mockUpdatedUserRaw = {
        ...mockUser,
        courses: [...mockUser.courses, new Types.ObjectId(courseIdToAdd)],
      };
      const mockUpdatedUser = {
        ...mockUpdatedUserRaw,
        // Mock toObject simply returns the object itself (already excludes password)
        toObject: (): UserWithoutPassword => mockUpdatedUserRaw,
      };

      jest
        .spyOn(mockUsersService, 'addCourseToUser')
        .mockResolvedValueOnce(mockUpdatedUser as unknown as UserDocument);

      const result = await controller.addCourseToUser(
        mockRequest,
        courseIdToAdd,
      );

      expect(mockUsersService.addCourseToUser).toHaveBeenCalledWith(
        mockUserId,
        courseIdToAdd,
      );
      expect(result._id).toEqual(mockUserId);
      expect(result.courses.map((id) => id.toString())).toContain(
        courseIdToAdd,
      );
      expect(result['password']).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should return a single course by id', async () => {
      const result = await controller.findOne(mockCourseId.toHexString());
      expect(result).toEqual(mockCourse);
      expect(mockCoursesService.findOne).toHaveBeenCalledWith(
        mockCourseId.toHexString(),
      );
    });
  });

  describe('create', () => {
    it('should create and return a course', async () => {
      const createDto: CreateCourseDto = {
        name: 'New Course',
        description: 'New Description',
      };
      const mockCreatedCourse = {
        ...mockCourse,
        ...createDto,
      };
      jest
        .spyOn(mockCoursesService, 'create')
        .mockResolvedValueOnce(mockCreatedCourse as any);

      const result = await controller.create(createDto);
      expect(result.name).toEqual(createDto.name);
      expect(result.description).toEqual(createDto.description);
      expect(mockCoursesService.create).toHaveBeenCalledWith(createDto);
    });
  });
});
