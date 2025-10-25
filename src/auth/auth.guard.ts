import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
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

  constructor(
    @InjectPinoLogger(AuthGuard.name)
    private readonly logger: PinoLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return new Promise((resolve, reject) => {
      this.jwtCheck(request, response, (err: any) => {
        if (err) {
          this.logger.warn(
            {
              error: err.message,
              url: request.url,
              method: request.method,
              expectedAudience: process.env.AUTH0_AUDIENCE,
              expectedIssuer: `https://${process.env.AUTH0_DOMAIN}/`,
            },
            'JWT validation failed',
          );
          reject(new UnauthorizedException(`Invalid token: ${err.message}`));
        } else {
          this.logger.debug(
            {
              url: request.url,
              method: request.method,
              sub: request.auth?.sub,
            },
            'JWT validation successful',
          );
          resolve(true);
        }
      });
    });
  }
}