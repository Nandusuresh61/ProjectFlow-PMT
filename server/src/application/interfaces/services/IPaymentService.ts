export interface PaymentOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface IPaymentService {
  createOrder(amount: number, currency: string, receipt: string): Promise<PaymentOrderResponse>;
  verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean>;
}
