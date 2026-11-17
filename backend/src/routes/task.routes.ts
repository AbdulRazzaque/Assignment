import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  updateTaskPrioritySchema,
  taskQuerySchema,
} from '../validators/task.validator';

const router = Router();

// All task routes require authentication
router.use(requireAuth);

router.post('/', validate(createTaskSchema), TaskController.createTask);
router.get('/', validate(taskQuerySchema, 'query'), TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.patch('/:id', validate(updateTaskSchema), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
router.patch('/:id/status', validate(updateTaskStatusSchema), TaskController.updateTaskStatus);
router.patch('/:id/priority', validate(updateTaskPrioritySchema), TaskController.updateTaskPriority);

export default router;
