"use client";
import Navbar from '@/components/Navbar/Navbar';
import Chatbot from '@/components/Chatbot/Chatbot';
import { useUser } from "@/context/UserContext";


export default function ChatbotPage() {
    const { user } = useUser();
    return (
        <div>
            <Navbar user={user} />
            <main className="pt-20">
                <Chatbot user={user} />
            </main>
        </div>
    );
}
