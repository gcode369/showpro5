import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redis } from '../database/redis';
import { JwtService } from '../auth/JwtService';

export class WebSocketManager {
  private io: Server;
  private jwtService: JwtService;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
      }
    });

    this.jwtService = new JwtService();
    this.setupRedisAdapter();
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private async setupRedisAdapter() {
    const pubClient = redis.duplicate();
    const subClient = redis.duplicate();
    
    this.io.adapter(createAdapter(pubClient, subClient));
  }

  private setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        await this.jwtService.validateToken(token);
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
      });
    });
  }

  public emit(event: string, room: string, data: any) {
    this.io.to(room).emit(event, data);
  }
}