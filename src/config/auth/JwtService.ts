import jwt from 'jsonwebtoken';
import { redis } from '../database/redis';

export class JwtService {
  private readonly ACCESS_TOKEN_TTL = '15m';
  private readonly REFRESH_TOKEN_TTL = '7d';
  
  async generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: this.ACCESS_TOKEN_TTL }
    );

    const refreshToken = jwt.sign(
      { userId, version: Date.now() },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: this.REFRESH_TOKEN_TTL }
    );

    // Store refresh token in Redis
    await redis.setex(
      `refresh_token:${userId}`,
      7 * 24 * 60 * 60, // 7 days
      refreshToken
    );

    return { accessToken, refreshToken };
  }

  async validateToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}