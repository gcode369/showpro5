import { prisma } from '../../config/database/prisma';
import { redis } from '../../config/database/redis';

export class AnalyticsService {
  private readonly CACHE_TTL = 3600; // 1 hour

  async trackPageView(userId: string, page: string) {
    await prisma.pageView.create({
      data: {
        userId,
        page,
        timestamp: new Date()
      }
    });
  }

  async getPopularProperties(limit: number = 10) {
    const cacheKey = `analytics:popular_properties:${limit}`;
    
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const properties = await prisma.property.findMany({
      take: limit,
      orderBy: {
        views: 'desc'
      },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(properties));
    return properties;
  }

  async getUserEngagement(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pageViews: true,
        bookings: true,
        favorites: true
      }
    });
  }
}