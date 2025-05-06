import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation((pass) => `hashed_${pass}`),
  compareSync: jest.fn().mockImplementation((pass, hashed) => hashed === `hashed_${pass}`)
}));

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockImplementation((data) => ({
                id: 1,
                email: data.data.email,
                password: data.data.password 
              })),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create user with hashed password', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'plainpassword',
    };

    const result = await service.createUser(userData);

    expect(result).toHaveProperty('id', 1);
    expect(result.email).toBe(userData.email);
    expect(result.password).not.toBe(userData.password);
    expect(result.password).toBe(`hashed_${userData.password}`);
  });
});