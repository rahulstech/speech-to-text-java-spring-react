import { useAppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectedRouterProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export default function ProtectedRouter({ children, requireAuth = true }: ProtectedRouterProps) {
    const { isLoggedIn } = useAppContext();

    if (requireAuth && !isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (!requireAuth && isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}