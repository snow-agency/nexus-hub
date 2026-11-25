import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/project/project.routes.js';
import { errorHandler } from './middlewares/error-handler.js';
import { authLimiter } from './middlewares/rate-limit.js';
import onboardingRoutes from './modules/onboarding/onboarding.routes.js';
import taskRoutes from './modules/task/task.routes.js';
import financeRoutes from './modules/finance/finance.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import nextActionRoutes from './modules/next-action/next-action.routes.js';
import strategyRoutes from './modules/strategy/strategy.routes.js';
import bmcRoutes from './modules/bmc/bmc.routes.js';
import teamRoutes from './modules/team/team.routes.js';
import networkRoutes from './modules/network/network.routes.js';
import performanceRoutes from './modules/performance/performance.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import proposalRoutes from './modules/proposals/proposals.routes.js';

const app = express();

app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 1));

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
  : null;

app.use(helmet());
app.use(cors(allowedOrigins ? { origin: allowedOrigins } : undefined));
app.use(morgan('dev'));
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authLimiter, authRoutes);
app.use('/projects', projectRoutes);
app.use('/onboarding', onboardingRoutes);
app.use('/tasks', taskRoutes);
app.use('/finance', financeRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/next-action', nextActionRoutes);
app.use('/strategy', strategyRoutes);
app.use('/bmc', bmcRoutes);
app.use('/team', teamRoutes);
app.use('/network', networkRoutes);
app.use('/performance', performanceRoutes);
app.use('/chat', chatRoutes);
app.use('/proposals', proposalRoutes);
app.use(errorHandler);

export default app;
