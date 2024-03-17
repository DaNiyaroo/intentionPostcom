import { BadRequestException, Body, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { env } from 'process';
import { UserRole } from 'src/common/enum/user.role.enum';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/create-login.dto';
import { CreateOtpDto } from './dto/create-otp.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { MailService } from './mail.service';
import { authenticator } from 'otplib';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly emailService: MailService,
    private readonly jwtService: JwtService,
  ) { }
  async sendOtp(createOtpDto: CreateOtpDto): Promise<{ message: string }> {
    try {
      const { email } = createOtpDto;
      let user = await this.userRepo.findOne({ where: { email } });

      if (user) {
        throw new BadRequestException(`User with email ${email} already exists`);
      }
      const secret = authenticator.generateSecret();
      const otp = authenticator.generate(secret);

      const otpCreatedAt = new Date();

      user = this.userRepo.create({ email, otp, otpCreatedAt });
      await this.userRepo.save(user);
      await this.emailService.sendOtpEmail(email, otp);
      return { message: 'OTP sent. Please check your email for the code.' };
    } catch (error) {
      console.error(error);
      throw error
    }
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        throw new BadRequestException(`User with email ${email} does not exist`);
      }
      const secret = authenticator.generateSecret();
      const otp = authenticator.generate(secret);

      user.otp = otp;
      user.otpCreatedAt = new Date();

      await this.userRepo.save(user);
      await this.emailService.sendOtpEmail(email, otp);
      return { message: 'New OTP sent. Please check your email for the code.' };
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{ accessToken: string; refreshToken: string; message: string } | null> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user || user.otp !== otp) {
        throw new BadRequestException('Invalid OTP');
      }
      const otpLifetime = 60 * 60 * 1000;
      const now = new Date();
      if (now.getTime() - user.otpCreatedAt.getTime() > otpLifetime) {
        throw new BadRequestException('OTP has expired');
      }
      user.otp = null;
      await this.userRepo.save(user);

      const accessToken = this.jwtService.sign(
        { userId: user.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '1h' },
      );
      const refreshToken = this.jwtService.sign(
        { userId: user.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '7d' },
      );
      user.token = refreshToken;
      await this.userRepo.save(user);

      return { accessToken, refreshToken, message: 'Verification successful' };
    } catch (error) {
      console.error('Error in verifyOtp:', error);
      throw error;
    }
  }

  async completeRegistration(@Body() createRegistrationDto: CreateRegistrationDto, @Req() req: RequestWithUser): Promise<{ accessToken: string; refreshToken: string; message: string } | User> {
    try {
      const { firstname, lastname, username, password, phone } = createRegistrationDto;
      if (!req.user) {
        throw new UnauthorizedException('User object is not defined');
      }
      const user = await this.userRepo.findOne({ where: { id: req.user.userId } });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      const existingUser = await this.userRepo.findOne({ where: { username } });
      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }
      user.firstname = firstname;
      user.lastname = lastname;
      user.username = username;
      user.password = await bcrypt.hash(password, 10); 
      user.phone = phone;

      const updatedUser = await this.userRepo.save(user);

      const accessToken = this.jwtService.sign(
        { userId: updatedUser.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '1h' },
      );
      const refreshToken = this.jwtService.sign(
        { userId: updatedUser.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '7d' },
      );
      updatedUser.token = refreshToken;
      await this.userRepo.save(user);
      return { accessToken, refreshToken, message: 'Registration successful' };
    } catch (error) {
      console.error('Error in completeRegistration:', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string } | User> {
    try {
      const { usernameOrEmail, password } = loginDto;
      const user = await this.userRepo.findOne({
        where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      const accessToken = this.jwtService.sign(
        { userId: user.id, role: user.role },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '1h' },
      );
      const refreshToken = this.jwtService.sign(
        { userId: user.id, role: user.role },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '7d' },
      );
      user.token = refreshToken;
      await this.userRepo.save(user);
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  async sendResetPasswordEmail(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        throw new BadRequestException(`User with email ${email} does not exist`);
      }
      const resetPasswordToken = crypto.randomBytes(20).toString('hex');

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000);

      await this.userRepo.save(user);
      const resetUrl = `http://localhost:3000/reset-password/${resetPasswordToken}`;
      await this.emailService.sendResetPasswordEmail(email, resetUrl);
      return { message: 'Reset password email sent. Please check your email for the link.' };
    } catch (error) {
      throw error;
    }
  }

  async findUserByResetToken(token: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { resetPasswordToken: token } });
    if (!user) {
      throw new BadRequestException('Invalid reset password token');
    }
    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset password token has expired');
    }
    return user;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { refreshToken } = refreshTokenDto;
      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token provided');
      }
      let userId: number;
      try {
        const decodedToken = this.jwtService.verify(refreshToken, { secret: env.ACCESS_TOKEN_SECRET });
        userId = decodedToken.userId;
      } catch (error) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.userRepo.findOne({where: {id: userId}});
      if (!user || user.token !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newAccessToken = this.jwtService.sign(
        { userId: user.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '1d' },
      );
      const newRefreshToken = this.jwtService.sign(
        { userId: user.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '7d' },
      );
      user.token = newRefreshToken;
      await this.userRepo.save(user);
  
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Error in refreshToken:', error);
      throw error;
    }
  }

  async logout(@Req() req: RequestWithUser): Promise<{ message: string }> {
    try {
      const user = await this.userRepo.findOne({ where: { id: req.user.userId } });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      user.token = null;
      await this.userRepo.save(user);
    
      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }
}