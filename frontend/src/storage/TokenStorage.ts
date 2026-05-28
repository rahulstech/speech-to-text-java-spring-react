const ACCESS_TOKEN_KEY = "access_token"

class TokenStorage {

    private key: string;

    constructor(key: string) {
        this.key = key;
    } 

    save(token: string): void {
        localStorage.setItem(this.key, token)
    }

    get(): string | null {
        return localStorage.getItem(this.key) ?? null
    }

    remove(): void {
        localStorage.removeItem(this.key)
    }

    has(): boolean {
        const key = this.get()
        return key != null
    }
}

export const accessTokenStorage = new TokenStorage(ACCESS_TOKEN_KEY);