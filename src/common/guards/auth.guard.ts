import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {} 

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers?.authorization) {
      throw new UnauthorizedException('No token provided');
    }
    const token = request.headers?.authorization.split(" ")[1]; 
    if (token) {
      try {
        const verifyOptions = {
          secret: process.env.ACCESS_TOKEN_SECRET,
        };
        const { userId, role } = await this.jwtService.verify(token, verifyOptions); 
        request.user = { userId, role }; 
        return true;
      } catch (error) {
        console.error('Error verifying token:', error);
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}