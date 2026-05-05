import express from "express";
import { config } from "./app.config";
import userRoutes from "@/presentation/routes/AuthRoutes";
import planRoutes from "@/presentation/routes/PlanRoutes";
import { connectDB } from "./infrastructure/database/connection";
import { connectRedis } from "./infrastructure/cache/redisClient";
import { errorMiddleware } from "./presentation/middlewares/ErrorMiddlware";
import cors from "cors";
import cookieParser from "cookie-parser";
import onboardingRoutes from "@/presentation/routes/OnboardingRoutes";
import superAdminRoutes from "@/presentation/routes/superAdminRoutes";
import workspaceRoutes from "@/presentation/routes/workspaceRoutes";
import userProfile from "@/presentation/routes/ProfileRoutes";
import projectRoutes from "@/presentation/routes/ProjectRoutes";
import issueRoutes from "@/presentation/routes/IssueRoutes";
import sprintRoutes from "@/presentation/routes/SprintRoutes";
import chatRoutes from "@/presentation/routes/ChatRoutes";
import subscriptionRoutes from "@/presentation/routes/SubscriptionRoutes";
import morgan from "morgan";

import http from "http";
import { SocketServer } from "./infrastructure/services/SocketServer";
import { ChatSocketHandler } from "./presentation/sockets/ChatSocketHandler";

const app = express();
const server = http.createServer(app);

const socketServer = SocketServer.init(server);
socketServer.registerHandler(ChatSocketHandler);

app.use(morgan("dev"));
connectDB();
connectRedis();

app.use(
  cors({
    origin: config.FRONTEND_BASE_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/profile", userProfile);
app.use("/api/project", projectRoutes);
app.use("/api/issue", issueRoutes);
app.use("/api/sprint", sprintRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/subscription", subscriptionRoutes);

app.use(errorMiddleware);

const port = config.PORT || 3000;
server.listen(port, () =>
  console.log(`Server is running on http://localhost:${config.PORT}`));
