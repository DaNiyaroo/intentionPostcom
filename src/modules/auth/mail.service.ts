import { Injectable } from "@nestjs/common";
import { env } from "src/common/config/env.config";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 587, 
      secure: false, 
      auth: {
        user: env.USER, 
        pass: env.PASS, 
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: env.USER, 
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is: ${otp}`,
    });
  }

  async sendResetPasswordEmail(email: string, resetUrl: string): Promise<void> {
    const mailOptions = {
      from:  env.USER,
      to: email, 
      subject: 'Reset Password',
      text: `You requested a password reset. Please go to the following url to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Please go to the following url to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`, 
    };
    await this.transporter.sendMail(mailOptions);
  }
}