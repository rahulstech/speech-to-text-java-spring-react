import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userLogin, userRegistration } from "../services/AuthService";
import type { AuthResponse } from "../services/types";
import { accessTokenStorage } from "../storage/TokenStorage";
import { userStorage } from "../storage/UserStorage";
import { useAppContext } from "../context/AppContext";

export function useUserRegistraiton() {
    const { changeLoggedIn } = useAppContext()
    return useMutation({
        mutationFn: userRegistration,
        onSuccess(data: AuthResponse) {
            accessTokenStorage.save(data.tokens.accessToken)
            userStorage.save(data.user)
            changeLoggedIn(true)
        }
    })
}

export function useUserLogIn() {
    const { changeLoggedIn } = useAppContext()
    return useMutation({
        mutationFn: userLogin,
        onSuccess(data: AuthResponse) {
            accessTokenStorage.save(data.tokens.accessToken)
            userStorage.save(data.user)
            changeLoggedIn(true)
        },
    })
}


export function useUserLogout() {
    const { changeLoggedIn } = useAppContext()
    const client = useQueryClient()
    return useMutation({
        mutationFn: () => Promise.resolve(true), // a fake api logout function
        onSuccess() {
            // clear query cache
            client.clear()

            // clear storage
            accessTokenStorage.remove()
            userStorage.remove()

            // change in app context
            changeLoggedIn(false)
        }
    })
}
