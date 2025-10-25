import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import axios from 'axios';

export interface Auth0UserInfo {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  private readonly auth0Domain = process.env.AUTH0_DOMAIN;

  constructor(
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
  ) {}

  async getUserInfo(accessToken: string): Promise<Auth0UserInfo> {
    this.logger.info({ domain: this.auth0Domain }, 'Fetching user info from Auth0');
    try {
      const response = await axios.get(`https://${this.auth0Domain}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      this.logger.info({ sub: response.data.sub, email: response.data.email }, 'Successfully fetched user info from Auth0');
      return response.data;
    } catch (error: any) {
      this.logger.error({ error: error.message, domain: this.auth0Domain }, 'Failed to fetch user info from Auth0');
      throw error;
    }
  }
}
