import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/project/project.routes.js';
import { errorHandler } from './middlewares/error-handler.js';
import onboardingRoutes from './modules/onboarding/onboarding.routes.js';
import taskRoutes from './modules/task/task.routes.js';
import financeRoutes from './modules/finance/finance.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/onboarding', onboardingRoutes);
app.use('/tasks', taskRoutes);
app.use('/finance', financeRoutes);
app.use('/dashboard', dashboardRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API démarrée sur http://localhost:${port}`);
});
