import { randomUUID } from "crypto";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";

export class UidService implements IUidGenerator {
  createId(): string {
    return randomUUID();
  }
}
