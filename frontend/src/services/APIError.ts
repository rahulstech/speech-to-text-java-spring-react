export class APIError extends Error {

    public code: number
    public reason: string | string[]

    constructor(code: number, reason: string | string[]) {
        super()
        this.code = code
        this.reason = reason
        this.name = this.constructor.name
    }
}