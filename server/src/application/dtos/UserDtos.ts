export type RegisterVerifiedUserDto = {
    fullName: string;
    email:string;
    passwordHash: string
}

export type UserAuthResponseDto ={
    accessToken: string;
    refreshToken: string;
}

export type StartRegisterDto = {
    fullName: string,
    email: string,
    password: string
}