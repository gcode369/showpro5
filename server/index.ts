import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { authRouter } from './routes/auth';
import { propertyRouter } from './routes/properties';
import { bookingRouter } from './routes/bookings';
import { agentRouter } from './routes/agents';
import { notificationRouter } from './routes/notifications';
import { authenticateToken } from './middleware/auth';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/properties', authenticateToken, propertyRouter);
app.use('/api/bookings', authenticateToken, bookingRouter);
app.use('/api/agents', authenticateToken, agentRouter);
app.use('/api/notifications', authenticateToken, notificationRouter);

// WebSocket handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join-room', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});