"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type User = {
    userId: number;
    username: string;
    email: string;
    role: string;
}

interface NavbarProps {
    user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <header className="bg-white z-50 fixed top-0 left-0 w-full border h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="p-5 flex items-center">
                <Link href="/" passHref>
                    <Image
                        src="/ftr-logo.avif"
                        alt="Logo"
                        width={36}
                        height={30}
                        className="cursor-pointer"
                        style={{ height: "auto" }}
                    />
                </Link>
                <button className="text-3xl md:hidden ml-5" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                    <svg aria-hidden="true" className="svg-inline--fa fa-bars fa-xs" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32-14.3 32 32z" />
                    </svg>
                </button>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex font-bold text-black mx-auto">
                <li><Link href="/" className="px-6 py-6 hover:text-blue-500">Home</Link></li>
                <li><Link href="/nfl" className="px-6 py-6 hover:text-blue-500">NFL</Link></li>
                <li><Link href="/nba" className="px-6 py-6 hover:text-blue-500">NBA</Link></li>
                <li><Link href="/mlb" className="px-6 py-6 hover:text-blue-500">MLB</Link></li>
                <li><Link href="/chatbot" className="px-6 py-6 hover:text-blue-500">Chatbot</Link></li>
                {user?.role === "admin" && (
                    <li><Link href="/admin/feedback-manager" className="px-6 py-6 hover:text-blue-500">FeedbackManager</Link></li>
                )}
            </ul>

            {/* Right Section */}
            <div className="flex items-center mr-8">
                <Link href="/pricing" className="px-6 py-3 text-gray-800 font-semibold bg-yellow-200 rounded-full">
                    Premium
                </Link>
                <div className="ml-4 relative">
                    <button className="w-10 h-10 rounded-full border border-gray-300 shadow-sm bg-white flex items-center justify-center">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png"
                            alt="User Avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    </button>
                    {/* Placeholder for login dropdown */}
                </div>
            </div>

            {/* Mobile Navigation Links */}
            <ul
                className={`fixed w-full top-0 left-0 bg-white z-40 py-24 text-black duration-500 transition-all ${
                    showMobileMenu ? "left-0" : "left-[-100%]"
                }`}
            >
                <li className="px-12"><Link href="/" className="py-6 block font-bold">Home</Link></li>
                <li className="px-12"><Link href="/nfl" className="py-6 block font-bold">NFL</Link></li>
                <li className="px-12"><Link href="/nba" className="py-6 block font-bold">NBA</Link></li>
                <li className="px-12"><Link href="/mlb" className="py-6 block font-bold">MLB</Link></li>
                <li className="px-12"><Link href="/chatbot" className="py-6 block font-bold">Chatbot</Link></li>
                {user?.role === "admin" && (
                    <li className="px-12"><Link href="/admin/feedback-manager" className="py-6 block font-bold">FeedbackManager</Link></li>
                )}
                <li className="px-12 mt-10"><Link href="/sign-in" className="block text-center px-6 py-3 text-gray-800 font-semibold bg-blue-200 rounded-full">Sign In</Link></li>
                <li className="px-12 mt-5"><Link href="/pricing" className="block text-center px-6 py-3 text-gray-800 font-semibold bg-yellow-200 rounded-full">Premium</Link></li>
            </ul>
        </header>
    );
};

export default Navbar;
