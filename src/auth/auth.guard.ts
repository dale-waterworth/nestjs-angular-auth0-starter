import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { expressjwt } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';

@Injectable()
export class AuthGuard implements CanActivate {
  private issuer = process.env.AUTH0_DOMAIN;

  private jwtCheck = expressjwt({
    secret: expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${this.issuer}/.well-known/jwks.json`,
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${this.issuer}/`,
    algorithms: ['RS256'],
    credentialsRequired: true,
  });


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return new Promise((resolve, reject) => {
      this.jwtCheck(request, response, (err: any) => {
        if (err) {
          console.error('JWT Error:', err.message);
          console.error('Expected audience:', process.env.AUTH0_AUDIENCE);
          console.error('Expected issuer:', `https://${process.env.AUTH0_DOMAIN}/`);
          reject(new UnauthorizedException(`Invalid token: ${err.message}`));
        } else {
          resolve(true);
        }
      });
    });
  }
}