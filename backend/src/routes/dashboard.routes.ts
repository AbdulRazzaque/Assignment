import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(requireAuth);

router.get('/stats', DashboardController.getStats);
router.get('/activity', DashboardController.getActivity);
router.get('/recent-tasks', DashboardController.getRecentTasks);
router.get('/upcoming-tasks', DashboardController.getUpcomingTasks);

export default router;
