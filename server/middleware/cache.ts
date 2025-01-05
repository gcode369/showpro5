```typescript
import { redis } from '../config/redis';

export const cacheMiddleware = (duration: number) => {
  return async (req: any, res: any, next: any) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }
      
      res.sendResponse = res.json;
      res.json = (body: any) => {
        redis.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
```