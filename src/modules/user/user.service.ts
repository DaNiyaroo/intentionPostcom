import { Injectable, Req, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination } from "src/common/utils/pagination";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { FindAllDto } from "src/common/dto/findAll.dto";
import * as bcrypt from 'bcrypt';
import { ApiResponse } from "src/common/http/api.response";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }

  async getMe(@Req() req: RequestWithUser) {
    try {
      console.log('Request User:', req.user);
      const user = await this.userRepo.findOne({ where: { id: req.user.userId } });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      console.log('Found User:', user);
      return user
    } catch (error) {
      console.log('Error:', error);
      throw error
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { username, firstname, lastname, email, phone, password } = createUserDto
      const user = await this.userRepo.findOneBy({ email })
      if (user) {
        throw new BadRequestException(`User with email ${email} already exist`)
      }
      const userWithUsername = await this.userRepo.findOneBy({ username })
      if (userWithUsername) {
        throw new BadRequestException(`User with email ${username} already exist`)
      }
      const userphone = await this.userRepo.findOneBy({ phone });
      if (userphone) {
        throw new BadRequestException(`User with email ${phone} already exist`);
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const createUser = this.userRepo.create({ username, firstname, lastname, password: hashedPassword, email, phone });
      await this.userRepo.save(createUser);
      return "success"
    } catch (error) {
      throw error
    }
  }

  async findAll(findAllDto: FindAllDto) {
    try {
      const { page, limit, search } = findAllDto;
      const totalPostCount = await this.userRepo.count();
      const pagination = new Pagination(limit, page, totalPostCount);
      const posts = await this.userRepo
        .createQueryBuilder('user')
        .where('user.username LIKE :search', { search: `%${search}%` })
        .orWhere('user.firstname LIKE :search', { search: `%${search}%` })
        .orWhere('user.lastname LIKE :search', { search: `%${search}%` })
        .skip(pagination.offset)
        .take(limit)
        .getMany();
      return new ApiResponse(posts, pagination);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { username, firstname, lastname, email, phone, password } = updateUserDto;
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException(`User with id ${id} not found`);
      }
      if (username) {
        const userWithUsername = await this.userRepo.findOne({ where: { username } });
        if (userWithUsername && userWithUsername.id !== id) {
          throw new BadRequestException(`User with username ${username} already exists`);
        }
        user.username = username;
      }
      if (email) {
        const userWithEmail = await this.userRepo.findOne({ where: { email } });
        if (userWithEmail && userWithEmail.id !== id) {
          throw new BadRequestException(`User with email ${email} already exists`);
        }
        user.email = email;
      }
      if (phone) {
        const userWithPhone = await this.userRepo.findOne({ where: { phone } });
        if (userWithPhone && userWithPhone.id !== id) {
          throw new BadRequestException(`User with phone ${phone} already exists`);
        }
        user.phone = phone;
      }
      user.firstname = firstname ?? user.firstname;
      user.lastname = lastname ?? user.lastname;
      user.password = password ?? user.password;
      await this.userRepo.save(user);
      return "success"
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepo.findOneBy({ id })
      if (!user) {
        throw new NotFoundException(`User wwith id: ${id} not found`)
      }
      this.userRepo.delete({ id })
      return "success"
    } catch (error) {
      throw error
    }
  }
}