import express from 'express';
import { getDistricts, getDistrictLatest, getDistrictHistory, getDistrictCompare } from '../controllers/districts.js';

const router = express.Router();

// GET /api/districts?state_id=...
router.get('/', getDistricts);

// GET /api/districts/:id/latest
router.get('/:id/latest', getDistrictLatest);

// GET /api/districts/:id/history?months=12
router.get('/:id/history', getDistrictHistory);

// GET /api/districts/:id/compare?with=state
router.get('/:id/compare', getDistrictCompare);

export default router;
