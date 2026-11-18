import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import dashboardRoutes from './dashboard.routes';
import projectRoutes from './project.routes';
import tagRoutes from './tag.routes';
import teamRoutes from './team.routes';
import supportRoutes from './support.routes';
import { ApiResponse } from '../utils/apiResponse';

const router = Router();

// Health check endpoint with real MongoDB connection telemetry
router.get('/health', (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  ApiResponse.success(res, 'TaskFlow API is healthy and operational', {
    status: dbReady ? 'healthy' : 'degraded',
    database: dbReady ? 'connected' : 'disconnected',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/projects', projectRoutes);
router.use('/tags', tagRoutes);
router.use('/team', teamRoutes);
router.use('/support', supportRoutes);

export default router;
