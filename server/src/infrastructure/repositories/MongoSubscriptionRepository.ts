import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";
import { Subscription } from "@/domain/entities/Subscription";
import { MongoSubscriptionModel, SubscriptionDoc } from "../database/models/MongoSubscriptionModel";
import { MongoBaseRepository } from "./MongoBaseRepository";

export class MongoSubscriptionRepository
  extends MongoBaseRepository<Subscription, SubscriptionDoc>
  implements ISubscriptionRepository
{
  constructor() {
    super(MongoSubscriptionModel);
  }

  protected mapToEntity(doc: SubscriptionDoc): Subscription {
    return new Subscription(
      doc.subscriptionId,
      doc.workspaceId,
      doc.planId,
      doc.status,
      doc.startDate,
      doc.endDate,
      doc.billingCycle as "monthly",
      doc.razorpayOrderId,
      doc.razorpayPaymentId,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findById(id: string): Promise<Subscription | null> {
    return this.findOne({ subscriptionId: id });
  }

  async findByWorkspaceId(workspaceId: string): Promise<Subscription | null> {
    return this.findOne({ workspaceId });
  }

  async update(subscription: Subscription): Promise<Subscription> {
    const updated = await this.updateOne(
      { subscriptionId: subscription.subscriptionId },
      {
        status: subscription.status,
        planId: subscription.planId,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        razorpayOrderId: subscription.razorpayOrderId,
        razorpayPaymentId: subscription.razorpayPaymentId,
      }
    );
    if (!updated) throw new Error("Subscription not found");
    return updated;
  }

  async findExpired(date: Date): Promise<Subscription[]> {
    return this.find({
      endDate: { $lt: date },
      status: "active",
    });
  }
}
