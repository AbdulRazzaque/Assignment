import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTagSchema, updateTagSchema } from '../validators/workspace.validator';

const router = Router();
router.use(requireAuth);

router.get('/', TagController.getTags);
router.post('/', validate(createTagSchema), TagController.createTag);
router.patch('/:id', validate(updateTagSchema), TagController.updateTag);
router.delete('/:id', TagController.deleteTag);

export default router;
