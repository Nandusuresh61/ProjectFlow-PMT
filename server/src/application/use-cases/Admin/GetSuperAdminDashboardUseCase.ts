import { WorkspaceModel } from "@/infrastructure/database/models/MongoWorkspaceModel";
import { UserModel } from "@/infrastructure/database/models/MongoUserModel";
import { MongoSubscriptionModel } from "@/infrastructure/database/models/MongoSubscriptionModel";
import { TicketModel } from "@/infrastructure/database/models/MongoTicketModel";

export interface DashboardStatsDto {
  totalWorkspaces: number;
  totalWorkspacesChange: number;
  totalUsers: number;
  totalUsersChange: number;
  activeSubscriptions: number;
  activeSubscriptionsChange: number;
  pendingTickets: number;
  revenueThisMonth: number;
  revenueThisMonthChange: number;
  newWorkspacesThisMonth: number;
  newWorkspacesThisMonthChange: number;
}

export interface RevenueOverviewDto {
  monthlyRevenue: number;
  yearlyRevenue: number;
  activePaidOrganizations: number;
  monthlyHistory: { month: string; revenue: number }[];
}

export interface WorkspaceGrowthDto {
  newlyCreated: number;
  trial: number;
  upgraded: number;
  growthHistory: { month: string; count: number }[];
}

export interface RecentWorkspaceDto {
  workspaceId: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  planName: string;
  membersCount: number;
  createdAt: Date;
  status: "active" | "suspended" | "trial";
}

export interface PendingTicketDto {
  ticketId: string;
  title: string;
  workspaceName: string;
  priority: string;
  status: string;
  createdAt: Date;
}

export class GetSuperAdminDashboardUseCase {
  async getStats(): Promise<DashboardStatsDto> {
    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfCurrentMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const endOfLastMonth = new Date(startOfCurrentMonth);
    endOfLastMonth.setMilliseconds(-1);

    // Queries for current state
    const totalWorkspaces = await WorkspaceModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();
    const activeSubscriptions = await MongoSubscriptionModel.countDocuments({ status: "active" });
    const pendingTickets = await TicketModel.countDocuments({ status: { $in: ["OPEN", "IN_PROGRESS"] } });

    // Current Month Revenue
    const revenueThisMonthResult = await MongoSubscriptionModel.aggregate([
      { $match: { createdAt: { $gte: startOfCurrentMonth }, status: "active" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenueThisMonth = revenueThisMonthResult[0]?.total || 0;

    // New Workspaces Current Month
    const newWorkspacesThisMonth = await WorkspaceModel.countDocuments({ createdAt: { $gte: startOfCurrentMonth } });

    // Queries for previous state to compute trends
    const workspacesLastMonth = await WorkspaceModel.countDocuments({ createdAt: { $lt: startOfCurrentMonth } });
    const usersLastMonth = await UserModel.countDocuments({ createdAt: { $lt: startOfCurrentMonth } });
    
    const activeSubscriptionsLastMonth = await MongoSubscriptionModel.countDocuments({ 
      status: "active",
      createdAt: { $lt: startOfCurrentMonth } 
    });

    const revenueLastMonthResult = await MongoSubscriptionModel.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          status: "active" 
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenueLastMonth = revenueLastMonthResult[0]?.total || 0;

    const newWorkspacesLastMonth = await WorkspaceModel.countDocuments({ 
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
    });

    // Helper to calculate percentage change
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      totalWorkspaces,
      totalWorkspacesChange: calculateChange(totalWorkspaces, workspacesLastMonth),
      totalUsers,
      totalUsersChange: calculateChange(totalUsers, usersLastMonth),
      activeSubscriptions,
      activeSubscriptionsChange: calculateChange(activeSubscriptions, activeSubscriptionsLastMonth),
      pendingTickets,
      revenueThisMonth,
      revenueThisMonthChange: calculateChange(revenueThisMonth, revenueLastMonth),
      newWorkspacesThisMonth,
      newWorkspacesThisMonthChange: calculateChange(newWorkspacesThisMonth, newWorkspacesLastMonth)
    };
  }

  async getRevenueOverview(): Promise<RevenueOverviewDto> {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    // Yearly Revenue
    const yearlyRevenueResult = await MongoSubscriptionModel.aggregate([
      { $match: { createdAt: { $gte: startOfYear }, status: "active" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const yearlyRevenue = yearlyRevenueResult[0]?.total || 0;

    // Monthly Revenue
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenueResult = await MongoSubscriptionModel.aggregate([
      { $match: { createdAt: { $gte: startOfCurrentMonth }, status: "active" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    // Active Paid Organizations
    const activePaidOrgs = await MongoSubscriptionModel.distinct("workspaceId", { status: "active" });
    const activePaidOrganizations = activePaidOrgs.length;

    // Last 12 Months history
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyHistoryRaw = await MongoSubscriptionModel.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo }, status: "active" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format monthly history for UI
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyHistory = [];

    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(now.getMonth() - 11 + i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed

      const match = monthlyHistoryRaw.find(
        (h) => h._id.year === year && h._id.month === month
      );

      monthlyHistory.push({
        month: `${monthNames[month - 1]} ${year}`,
        revenue: match ? match.revenue : 0
      });
    }

    return {
      monthlyRevenue,
      yearlyRevenue,
      activePaidOrganizations,
      monthlyHistory
    };
  }

  async getWorkspaceGrowth(): Promise<WorkspaceGrowthDto> {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const newlyCreated = await WorkspaceModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    // We assume Free plans have no active subscriptions or the planId is 'FREE'
    const trial = await WorkspaceModel.countDocuments({ planId: "FREE" });
    const upgraded = await MongoSubscriptionModel.distinct("workspaceId", { status: "active" }).then(ids => ids.length);

    // Last 6 months growth history
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const growthHistoryRaw = await WorkspaceModel.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const growthHistory = [];

    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(now.getMonth() - 5 + i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;

      const match = growthHistoryRaw.find(
        (h) => h._id.year === year && h._id.month === month
      );

      growthHistory.push({
        month: `${monthNames[month - 1]} ${year}`,
        count: match ? match.count : 0
      });
    }

    return {
      newlyCreated,
      trial,
      upgraded,
      growthHistory
    };
  }

  async getRecentWorkspaces(page: number = 1, limit: number = 5): Promise<{ workspaces: RecentWorkspaceDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const total = await WorkspaceModel.countDocuments();

    const workspacesRaw = await WorkspaceModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "userId",
          as: "owner",
        },
      },
      { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "plans",
          localField: "planId",
          foreignField: "planId",
          as: "plan",
        },
      },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "memberships",
          localField: "workspaceId",
          foreignField: "workspaceId",
          as: "members",
        },
      },
      {
        $project: {
          workspaceId: 1,
          name: 1,
          ownerName: { $ifNull: ["$owner.fullName", "Unknown"] },
          ownerEmail: { $ifNull: ["$owner.email", "N/A"] },
          planName: { $ifNull: ["$plan.type", "FREE"] },
          isSuspended: 1,
          createdAt: 1,
          membersCount: { $size: "$members" },
        },
      },
    ]);

    // Active paid vs trial vs suspended status
    const workspaces: RecentWorkspaceDto[] = workspacesRaw.map((w) => {
      let status: "active" | "suspended" | "trial" = "trial";
      if (w.isSuspended) {
        status = "suspended";
      } else if (w.planName !== "FREE") {
        status = "active";
      }
      return {
        workspaceId: w.workspaceId,
        name: w.name,
        ownerName: w.ownerName,
        ownerEmail: w.ownerEmail,
        planName: w.planName,
        membersCount: w.membersCount,
        createdAt: w.createdAt,
        status,
      };
    });

    return {
      workspaces,
      total,
    };
  }

  async getPendingTickets(page: number = 1, limit: number = 5): Promise<{ tickets: PendingTicketDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const query = { status: { $in: ["OPEN", "IN_PROGRESS"] } };
    const total = await TicketModel.countDocuments(query);

    const ticketsRaw = await TicketModel.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspaceId",
          foreignField: "workspaceId",
          as: "workspace",
        },
      },
      { $unwind: { path: "$workspace", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          ticketId: 1,
          title: 1,
          workspaceName: { $ifNull: ["$workspace.name", "Unknown"] },
          priority: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ]);

    const tickets: PendingTicketDto[] = ticketsRaw.map((t) => ({
      ticketId: t.ticketId,
      title: t.title,
      workspaceName: t.workspaceName,
      priority: t.priority,
      status: t.status,
      createdAt: t.createdAt,
    }));

    return {
      tickets,
      total,
    };
  }
}
