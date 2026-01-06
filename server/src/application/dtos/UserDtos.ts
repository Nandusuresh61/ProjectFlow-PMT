export type RegisterUserDto = {
    fullName: string;
    email:string;
    password: string
}

export type UserAuthResponseDto ={
    accessToken: string;
    refreshToken: string;
}