import { Notification } from "@/domain/entities/Notification";
import { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import { MongoNotificationModel } from "../database/models/MongoNotificationModel";

export class MongoNotificationRepository implements INotificationRepository {
  private mapToDomain(doc: any): Notification {
    return new Notification(
      doc.notificationId,
      doc.receiverId,
      doc.workspaceId,
      doc.type,
      doc.title,
      doc.message,
      doc.isRead,
      doc.createdAt,
      doc.projectId
    );
  }

  async create(notification: Notification): Promise<Notification> {
    const newDoc = new MongoNotificationModel({
      notificationId: notification.notificationId,
      receiverId: notification.receiverId,
      workspaceId: notification.workspaceId,
      projectId: notification.projectId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    });

    await newDoc.save();
    return this.mapToDomain(newDoc);
  }

  async findByReceiverId(receiverId: string, skip: number, limit: number, workspaceId?: string): Promise<Notification[]> {
    const query: any = { receiverId };
    if (workspaceId) {
      query.workspaceId = workspaceId;
    }
    const docs = await MongoNotificationModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return docs.map(this.mapToDomain);
  }

  async countUnreadByReceiverId(receiverId: string, workspaceId?: string): Promise<number> {
    const query: any = { receiverId, isRead: false };
    if (workspaceId) {
      query.workspaceId = workspaceId;
    }
    return await MongoNotificationModel.countDocuments(query);
  }

  async markAsRead(notificationId: string, receiverId: string): Promise<boolean> {
    const result = await MongoNotificationModel.updateOne(
      { notificationId, receiverId },
      { $set: { isRead: true } }
    );
    return result.modifiedCount > 0;
  }

  async clearHistory(receiverId: string, workspaceId?: string): Promise<boolean> {
    const query: any = { receiverId };
    if (workspaceId) {
      query.workspaceId = workspaceId;
    }
    const result = await MongoNotificationModel.deleteMany(query);
    return result.acknowledged;
  }
}
