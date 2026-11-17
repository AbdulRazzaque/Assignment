import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import dashboardRoutes from './dashboard.routes';
import { ApiResponse } from '../utils/apiResponse';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  ApiResponse.success(res, 'TaskFlow API is healthy and operational', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
