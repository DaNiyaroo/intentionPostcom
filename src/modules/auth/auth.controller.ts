import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
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
import { ApiResponse } from 'src/common/http/api.response';
import { ResendPasswordDto } from './dto/resend-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }
  @Post('send-otp')
  async sendOtp(@Body() createOtpDto: CreateOtpDto): Promise<ApiResponse> {
    return this.authService.sendOtp(createOtpDto);
  }

  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: CreateOtpDto): Promise<ApiResponse> {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<ApiResponse> {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @UseGuards(AuthGuard)
  @Post('complete-registration')
  async completeRegistration(@Body() createRegistrationDto: CreateRegistrationDto, @Req() req: RequestWithUser): Promise<ApiResponse> {
    return this.authService.completeRegistration(createRegistrationDto, req);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('send-reset-password-email')
  async sendResetPasswordEmail(@Body() emailDto: CreateOtpDto): Promise<ApiResponse> {
    return this.authService.sendResetPasswordEmail(emailDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resendPasswordDto: ResendPasswordDto): Promise<ApiResponse> {
    return this.authService.findUserByResetToken(resendPasswordDto);
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