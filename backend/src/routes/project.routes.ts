import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/workspace.validator';

const router = Router();
router.use(requireAuth);

router.get('/', ProjectController.getProjects);
router.post('/', validate(createProjectSchema), ProjectController.createProject);
router.patch('/:id', validate(updateProjectSchema), ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

export default router;
