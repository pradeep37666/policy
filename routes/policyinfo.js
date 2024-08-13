import express from 'express';
import { findPolicyInfoByFirstName,getAggregatedPoliciesByUser ,scheduleMessage } from '../controllers/policyInfo.js';

const router = express.Router();

router.get('/policy-info', findPolicyInfoByFirstName);
router.get('/aggregated-policies', getAggregatedPoliciesByUser);
router.post('/schedule-message', scheduleMessage);

export default router;