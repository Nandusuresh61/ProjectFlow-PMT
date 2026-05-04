import Razorpay from "razorpay";
import crypto from "crypto";
import { IPaymentService, PaymentOrderResponse } from "@/application/interfaces/services/IPaymentService";
import { config } from "@/app.config";

export class RazorpayService implements IPaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, currency: string, receipt: string): Promise<PaymentOrderResponse> {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
    };

    const order = await this.razorpay.orders.create(options);
    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      receipt: order.receipt as string,
    };
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === signature;
  }
}
