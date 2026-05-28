import type { UserDetails } from "../services/types"

const KEY_USER_DETAILS = "user_details"


class UserStorage {

    private cachedUser: UserDetails | null = null

    save(user: UserDetails): void {
        const serialized = JSON.stringify(user)
        localStorage.setItem(KEY_USER_DETAILS, serialized)
        this.cachedUser = { ...user } // make a copy 
    }

    get(): UserDetails | null {
        if (this.cachedUser) {
            return this.cachedUser
        }
        const serialized = localStorage.getItem(KEY_USER_DETAILS)
        if (serialized) {
            this.cachedUser = JSON.parse(serialized)
        }
        return this.cachedUser
    }

    remove(): void {
        localStorage.removeItem(KEY_USER_DETAILS)
        this,this.cachedUser = null
    }
}

export const userStorage = new UserStorage()