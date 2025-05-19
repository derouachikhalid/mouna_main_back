import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
      passReqToCallback: true, // Allows access to the request object
    });
  }

  async validate(req: any, payload: any) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token manually
    if (!token) throw new UnauthorizedException('No token provided');

    if (await this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException(
        'Token has been invalidated. Please log in again.',
      );
    }

    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
