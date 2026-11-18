import { Router } from 'express';
import { TeamController } from '../controllers/team.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTeamMemberSchema, updateTeamMemberSchema } from '../validators/workspace.validator';

const router = Router();
router.use(requireAuth);

router.get('/', TeamController.getMembers);
router.post('/', validate(createTeamMemberSchema), TeamController.addMember);
router.patch('/:id', validate(updateTeamMemberSchema), TeamController.updateMember);
router.delete('/:id', TeamController.removeMember);

export default router;
