export type PendingRegistration = {
  fullName: string;
  email: string;
  passwordHash: string;
  otpHash: string;
  attempt: number;
  lastOtpSentAt: number
};

export interface IOtpStore {
  save(
    email: string,
    data: PendingRegistration,
    ttlSeconds: number
  ): Promise<void>;

  get(email: string): Promise<PendingRegistration | null>;

  update(email: string, data: PendingRegistration, ttlSeconds: number): Promise<void>;

  delete(email: string): Promise<void>;
}
