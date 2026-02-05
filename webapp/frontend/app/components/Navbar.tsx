'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    githubUsername: string;
    avatarUrl?: string;
}

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (error) {
            // User not logged in
        }
    };

    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/github`;
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (res.ok) {
                setUser(null);
                setShowDropdown(false);
                router.push('/');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? 'top-0 bg-[#0a0a0a]/95 backdrop-blur-md'
                : 'top-12 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold">Rootly</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <a href="/#features" className="hidden md:block text-zinc-400 hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="/#how-it-works" className="hidden md:block text-zinc-400 hover:text-white transition-colors">
                            How it Works
                        </a>
                        <Link href="/docs" className="hidden md:block text-zinc-400 hover:text-white transition-colors">
                            Docs
                        </Link>
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                >
                                    {user.avatarUrl && (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.githubUsername}
                                            className="w-9 h-9 rounded-full border-2 border-zinc-800"
                                        />
                                    )}
                                    <span className="text-zinc-300">@{user.githubUsername}</span>
                                    <svg className={`w-4 h-4 text-zinc-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-2">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setShowDropdown(false)}
                                            className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                                Dashboard
                                            </div>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
