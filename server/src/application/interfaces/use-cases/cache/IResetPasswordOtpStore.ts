export type PendingPasswordReset = {
  otpHash: string;
  attempt: number;
  lastOtpAttemptAt: number;
};

export interface IResetPasswordOtpStore {
  save(
    email: string,
    data: PendingPasswordReset,
    ttlSeconds: number,
  ): Promise<void>;

  get(email: string): Promise<PendingPasswordReset | null>;

  update(
    email: string,
    data: PendingPasswordReset,
    ttlSeconds: number,
  ): Promise<void>;

  delete(email: string): Promise<void>;
}
