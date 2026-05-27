import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { config } from "@/app.config";
import jwt from "jsonwebtoken";
import { ITokenPayload } from "@/shared/types/user.types";
import { logger } from "../utils/Logger";

export interface AuthenticatedSocket extends Socket {
  user?: ITokenPayload;
}

export class SocketServer {
  private static instance: SocketServer;
  private io: Server;

  private constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: config.ALLOWED_ORIGINS,
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupConnection();
  }

  public static init(server: HttpServer): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer(server);
    }
    return SocketServer.instance;
  }

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      throw new Error("SocketServer must be initialized with an HttpServer first.");
    }
    return SocketServer.instance;
  }

  private setupMiddleware() {
    this.io.use((socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers.cookie
        ?.split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET) as ITokenPayload;
        socket.user = decoded;
        next();
      } catch (_err) {
        next(new Error("Authentication error: Invalid token"));
      }
    });
  }

  private setupConnection() {
    this.io.on("connection", (socket: AuthenticatedSocket) => {
      logger.info(`Socket connected: ${socket.id} (User: ${socket.user?.userId})`);

      socket.on("disconnect", () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  public getIO(): Server {
    return this.io;
  }

  public registerHandler(handler: (io: Server, socket: AuthenticatedSocket) => void) {
    this.io.on("connection", (socket: AuthenticatedSocket) => {
      handler(this.io, socket);
    });
  }
}
