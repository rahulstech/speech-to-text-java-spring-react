import axios, { AxiosError } from "axios"
import type { AuthResponse, UserLoginRequest, UserRegistrationRequest } from "./types"
import { APIError } from "./APIError"

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth`
})

export async function userRegistration(req: UserRegistrationRequest): Promise<AuthResponse> {
    try {
        const resonse = await api.post<AuthResponse>(
                "/register",
                req,
            )
        return resonse.data
    }
    catch(error: any) {
        if (error instanceof AxiosError) {
            const code = error.response?.status
            if (code === 409) {
                throw new APIError(409, "user already exists")
            }
            else if (code === 400) {
                const errors = error.response?.data?.errors ?? "bad request"
                throw new APIError(400, errors)
            }
        }
        throw new Error("unknown error")
    }
}

export async function userLogin(req: UserLoginRequest): Promise<AuthResponse> {
    try {
        const response = await api.post<AuthResponse>("/login",req)
        return response.data
    }
    catch(error: any) {
        if (error instanceof AxiosError) {
            const code = error.response?.status
            if (code === 404) {
                throw new Error("user not found")
            }
            else if (code === 401) {
                throw new Error("incorrect password")
            }
            else if (code === 400) {
                const errors = error.response?.data?.errors ?? "bad request"
                throw new APIError(400, errors)
            }
        }
        throw new Error("unknown error")
    }
    
}
