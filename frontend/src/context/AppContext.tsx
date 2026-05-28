import { createContext, useContext, useState } from "react";
import { accessTokenStorage } from "../storage/TokenStorage";


export interface AppContext {
    isLoggedIn: boolean,
    changeLoggedIn: (boolean)=> void
}

const context = createContext<AppContext>({
    isLoggedIn: false,
    changeLoggedIn: (_)=> {}
})

export function useAppContext(): AppContext {
    return useContext(context);
}

export function AppContextProvider({ children }) {
    const [isLoggedIn, changeLoggedIn] = useState(accessTokenStorage.has())
    return (
        <context.Provider 
            value={{
                isLoggedIn,
                changeLoggedIn
            }}
        >
            {children}
        </context.Provider>
    )
}

