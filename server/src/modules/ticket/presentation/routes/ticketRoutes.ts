import { Router } from "express";
import { authenticatedUser } from "@/presentation/middlewares/AuthMiddleware";
import { superAdminOnly } from "@/presentation/middlewares/AdminMiddleware";
import { ticketController } from "../../infrastructure/DI/TicketContainer";

const router = Router();

// Workspace APIs
router.post("/", authenticatedUser, ticketController.createTicket);
router.get("/my-workspace", authenticatedUser, ticketController.getWorkspaceTickets);
router.get("/:ticketId", authenticatedUser, ticketController.getTicketDetails);
router.post("/:ticketId/messages", authenticatedUser, ticketController.replyToTicket);

// Admin APIs
router.get("/admin/all", authenticatedUser, superAdminOnly, ticketController.getAllTickets);
router.patch("/admin/:ticketId/status", authenticatedUser, superAdminOnly, ticketController.updateTicketStatus);
router.post("/admin/:ticketId/messages", authenticatedUser, superAdminOnly, ticketController.replyToTicket);

export default router;
