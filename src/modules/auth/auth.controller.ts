import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/create-login.dto';
import { CreateOtpDto } from './dto/create-otp.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }
  @Post('send-otp')
  async sendOtp(@Body() createOtpDto: CreateOtpDto): Promise<{ message: string }> {
    try {
      const result = await this.authService.sendOtp(createOtpDto);
      return result;
    } catch (error) {
      throw error
    }
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string): Promise<{ message: string }> {
    return this.authService.resendOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const result = await this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
      if ('accessToken' in result && 'refreshToken' in result) {
        return result;
      }
    } catch (error) {
      error
    }
  }
  @UseGuards(AuthGuard)
  @Post('complete-registration')
  async completeRegistration(@Body() createRegistrationDto: CreateRegistrationDto, @Req() req: RequestWithUser): Promise<{ accessToken: string; refreshToken: string; message: string }> {
    try {
      const result = await this.authService.completeRegistration(createRegistrationDto, req);
      if ('accessToken' in result && 'refreshToken' in result) {
        return { ...result, message: 'Registration successful' };
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Error in completeRegistration:', error);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('send-reset-password-email')
  async sendResetPasswordEmail(@Body('email') email: string): Promise<{ message: string }> {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body('password') password: string): Promise<{ message: string }> {
    const user = await this.authService.findUserByResetToken(token);

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepo.save(user);

    return { message: 'Password has been reset. You can now log in with your new password.' };
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @ApiBearerAuth('token')
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req);
  }

}