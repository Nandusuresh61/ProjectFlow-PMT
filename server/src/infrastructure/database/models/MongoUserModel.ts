import { Document, model, Schema } from "mongoose";

export interface UserDoc extends Document {
  userId: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  authProvider: string;
  providerId?: string;
  isOnboarded: boolean;
  currentWorkspaceId?: string;
  isSuperAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDoc>({
  userId: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: false,
  },
  authProvider: {
    type: String,
    required: true,
    default: "LOCAL",
  },
  providerId: {
    type: String,
    required: false,
  },
  isOnboarded: {
    type: Boolean,
    default: false,
  },
  currentWorkspaceId: {
    type: String,
    required: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export const UserModel = model<UserDoc>("User", UserSchema);
