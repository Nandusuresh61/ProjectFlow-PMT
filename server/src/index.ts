import express from 'express';
import { config } from './app.config';
import userRoutes from '@/presentation/routes/AuthRoutes'
import { connectDB } from './infrastructure/database/connection';


const app = express();
connectDB();

app.use(express.json());
app.use('/api/auth', userRoutes)


const port = config.PORT || 3000
app.listen(port, () => console.log(`http:localhost:${port}`))