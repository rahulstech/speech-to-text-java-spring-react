export interface ErrorResponse {
    code: number,
    errors: string[]
}

export interface UserRegistrationRequest {
    name: string,
    email: string,
    password: string
}

export interface UserLoginRequest {
    email: string,
    password: string,
}

export interface UserDetails {
    id: string,
    name: string,
    email: string
}

export interface AuthResponse {
    tokens: {
        accessToken: string
    },
    user: UserDetails
}

export interface History {
    id: number,
    audioFile: string,
    transcript: string,
    createdAt: string
}

export interface HistoryResponse {
    cursorBefore: number | null,
    cursorAfter: number | null,
    size: number,
    histories: History[]
}

export interface HistoryQuery {
    before?: number,
    after?: number,
    first: number,
}

export interface TranscriptRequest {
    audioUrl: string,
    lang: string | null
}