import express from 'express';
import { config } from './app.config';
import userRoutes from '@/presentation/routes/AuthRoutes'
import { connectDB } from './infrastructure/database/connection';
import { connectRedis } from './infrastructure/cache/redisClient';
import { errorMiddleware } from './presentation/middlewares/ErrorMiddlware';
import onboardingRoutes from "@/presentation/routes/OnboardingRoutes";
import cors from 'cors';
import cookieParser from 'cookie-parser'


const app = express();
connectDB();
connectRedis();

app.use(
  cors({
    origin: config.FRONTEND_BASE_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', userRoutes)
app.use("/api/onboarding", onboardingRoutes);

app.use(errorMiddleware);


const port = config.PORT || 3000
app.listen(port, () => console.log(`http:localhost:${port}`))
