import { ConflictException, Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Inject } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { PasswordValidationService } from "../validation/password.validation.service";
import { EmailValidationService } from "../validation/email.validation.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly password: PasswordValidationService,
    private readonly email: EmailValidationService,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async findById(id: number): Promise<User> { 
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    const { email, password } = userData;
    
    const emailErrors = this.email.getValidationErrors(email)
    if (emailErrors.length > 0) throw new BadRequestException(emailErrors);

    const passwordErrors = this.password.getValidationErrors(password)
    if(passwordErrors.length > 0) throw new BadRequestException(passwordErrors);
    
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictException('Email already registered');

    try {
      return await this.prisma.user.create({
        data: { email, password: await this.password.hash(password) }
      });
    } catch (error) {
      throw new InternalServerErrorException('Registration failed');
    }
  }

}