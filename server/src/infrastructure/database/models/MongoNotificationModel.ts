import mongoose, { Schema, Document } from "mongoose";
import { NotificationType } from "@/domain/entities/Notification";

export interface INotificationDocument extends Document {
  notificationId: string;
  receiverId: string;
  workspaceId: string;
  projectId?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    notificationId: { type: String, required: true, unique: true },
    receiverId: { type: String, required: true, index: true },
    workspaceId: { type: String, required: true },
    projectId: { type: String },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ receiverId: 1, isRead: 1 });

export const MongoNotificationModel = mongoose.model<INotificationDocument>(
  "Notification",
  NotificationSchema
);
