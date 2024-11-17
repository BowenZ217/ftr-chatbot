"use client";
import { useEffect } from "react";
import Navbar from '@/components/Navbar/Navbar';
import { useUser } from "@/context/UserContext";

export default function Home() {
    const { user, setUser } = useUser();
    useEffect(() => {
        const mockUser = {
            userId: 1,
            username: "ftr-admin",
            email: "ftradmin@test.com",
            role: "admin",
        };
        setUser(mockUser);
    }, [setUser]);

    return (
        <div>
            <Navbar user={user} />
            <main className="pt-20 px-6">
                <section className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to the Homepage</h1>
                    <p className="text-lg text-gray-600">
                        This is the homepage. Use the navigation bar to explore the Chatbot page and other features.
                    </p>
                </section>
            </main>
        </div>
    );
}
