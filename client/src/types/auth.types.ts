export interface SignUpPayload {
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface ApiError  {
    message: string
}
