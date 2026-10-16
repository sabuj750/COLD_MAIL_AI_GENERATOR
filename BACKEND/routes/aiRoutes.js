import express from 'express';
import { generateEmail , getHistory} from '../controllers/aiControllers.js';
import protect from '../middleware/protect.js';
const router = express.Router();

router.post('/generate-email' , protect , generateEmail);
router.get('/get-history' , protect , getHistory);

export default router;