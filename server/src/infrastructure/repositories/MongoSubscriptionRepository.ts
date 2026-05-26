import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";
import { Subscription } from "@/domain/entities/Subscription";
import { MongoSubscriptionModel, SubscriptionDoc } from "../database/models/MongoSubscriptionModel";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { SubscriptionStatus } from "@/shared/enums/SubscriptionStatus";

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
      doc.amount,
      doc.currency,
      doc.razorpayOrderId,
      doc.razorpayPaymentId,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async create(subscription: Subscription): Promise<Subscription> {
    const doc = {
      subscriptionId: subscription.subscriptionId,
      workspaceId: subscription.workspaceId,
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      billingCycle: subscription.billingCycle,
      amount: subscription.amount,
      currency: subscription.currency,
      razorpayOrderId: subscription.razorpayOrderId,
      razorpayPaymentId: subscription.razorpayPaymentId,
    };
    return super.create(doc);
  }

  async findById(id: string): Promise<Subscription | null> {
    return this.findOne({ subscriptionId: id });
  }

  async findByWorkspaceId(workspaceId: string): Promise<Subscription | null> {
    const docs = await this.model.find({ workspaceId }).sort({ createdAt: -1 }).limit(1).exec();
    return docs.length > 0 ? this.mapToEntity(docs[0]) : null;
  }

  async findAllByWorkspaceId(workspaceId: string): Promise<Subscription[]> {
    const docs = await this.model.find({ workspaceId }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async update(subscription: Subscription): Promise<Subscription> {
    const updated = await this.updateOne(
      { subscriptionId: subscription.subscriptionId },
      {
        status: subscription.status,
        planId: subscription.planId,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        amount: subscription.amount,
        currency: subscription.currency,
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
      status: SubscriptionStatus.ACTIVE,
    });
  }
}
