import express from 'express';
import { getDistribution, getFlow, getFlowDex,getLeaderboard, getDextradesStats, getWalletCounts, getUserGraph} from '../controllers/mongoController.js';

const router = express.Router();

router.get('/dist/:id/:numdays', getDistribution);
router.get('/flow/:id/:datatype/:numdays', getFlow);
router.get('/flowdex/:id/:numdays', getFlowDex);

router.get('/board/:id/:boardtype', getLeaderboard);
router.get('/traderstats/:id/:numdays', getDextradesStats);
router.get('/walletstats/:id/:numdays', getWalletCounts);
router.get('/graph/:userid/:token', getUserGraph);

export default router;