import { Router } from 'express';
import { SupportController } from '../controllers/support.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createSupportTicketSchema } from '../validators/workspace.validator';

const router = Router();
router.use(requireAuth);

router.get('/tickets', SupportController.getTickets);
router.post('/tickets', validate(createSupportTicketSchema), SupportController.createTicket);
router.delete('/tickets/:id', SupportController.deleteTicket);

export default router;
