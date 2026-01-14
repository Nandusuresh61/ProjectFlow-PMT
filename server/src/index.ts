import express from 'express';
import { config } from './app.config';
import userRoutes from '@/presentation/routes/AuthRoutes'
import { connectDB } from './infrastructure/database/connection';
import { connectRedis } from './infrastructure/cache/redisClient';
import { errorMiddleware } from './presentation/middlewares/ErrorMiddlware';


const app = express();
connectDB();
connectRedis();

app.use(express.json());
app.use('/api/auth', userRoutes)

app.use(errorMiddleware);


const port = config.PORT || 3000
app.listen(port, () => console.log(`http:localhost:${port}`))