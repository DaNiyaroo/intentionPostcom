import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; 
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split(' ')[1];

    if (token) {
      try {
        const verifyOptions = {
          secret: process.env.ACCESS_TOKEN_SECRET,
        };
        const { role } = this.jwtService.verify(token, verifyOptions);
        if (!requiredRoles.includes(role)) {
          throw new UnauthorizedException('Forbidden');
        }
        return true;
      } catch (error) {
        throw new UnauthorizedException(`${error.message}`);
      }
    }
    throw new UnauthorizedException(' Unauthorized');
  }
}