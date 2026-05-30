import React, { createContext, useContext, useState } from "react";
import { accessTokenStorage } from "../storage/TokenStorage";


export interface AppContext {
    isLoggedIn: boolean,
    changeLoggedIn: (newIsLoggedIn: boolean)=> void

    pageTitle: string,
    setPageTitle: (title: string)=> void
}

const context = createContext<AppContext>({
    isLoggedIn: false,
    changeLoggedIn: (_)=> {},
    pageTitle: "",
    setPageTitle: (_)=> {}
})

export function useAppContext(): AppContext {
    return useContext(context);
}

export function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, changeLoggedIn] = useState(accessTokenStorage.has())
    const [pageTitle, setPageTitle] = useState("")

    return (
        <context.Provider 
            value={{
                isLoggedIn,
                changeLoggedIn,
                pageTitle,
                setPageTitle
            }}
        >
            {children}
        </context.Provider>
    )
}

