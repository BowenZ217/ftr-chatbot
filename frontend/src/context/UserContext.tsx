"use client"
import { createContext, useContext, useState, ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";

type User = {
    userId: number;
    username: string;
    email: string;
    role: string; // "admin" or "user" or "premium"
} | null;

type UserContextType = {
    user: User;
    setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    return (
        <NextUIProvider>
            <UserContext.Provider value={{ user, setUser }}>
                {children}
            </UserContext.Provider>
        </NextUIProvider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
