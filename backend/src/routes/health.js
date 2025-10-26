import express from 'express';
import { getHealth } from '../controllers/health.js';

const router = express.Router();

// GET /api/health
router.get('/', getHealth);

export default router;
