"use client";
import Navbar from '@/components/Navbar/Navbar';
import FeedbackManager from '@/components/FeedbackManager/FeedbackManager';
import { useUser } from "@/context/UserContext";


export default function ChatbotPage() {
    const { user } = useUser();
    return (
        <div>
            <Navbar user={user} />
            <main className="pt-20">
                <FeedbackManager />
            </main>
        </div>
    );
}
