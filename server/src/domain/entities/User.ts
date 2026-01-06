export interface User {
    userId: string;
    fullName: string;
    email: string;
    passwordHash: string;
    isSuperAdmin: boolean;
    createdAt: Date
    updatedAt: Date
}