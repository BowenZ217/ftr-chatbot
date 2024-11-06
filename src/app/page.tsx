import React from 'react';
import Header from '@/components/Navbar/Navbar';
import Chatbot from '@/components/Chatbot/Chatbot';

export default function Home() {
    return (
        <div>
            <Header />
            <main className="pt-20">
                <Chatbot />
            </main>
        </div>
    );
}
