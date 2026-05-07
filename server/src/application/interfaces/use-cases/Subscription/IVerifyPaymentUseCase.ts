import { VerifyPaymentDto } from "@/application/use-cases/Subscription/VerifyPaymentUseCase";
import { Subscription } from "@/domain/entities/Subscription";

export interface IVerifyPaymentUseCase {
  execute(dto: VerifyPaymentDto): Promise<Subscription>;
}
