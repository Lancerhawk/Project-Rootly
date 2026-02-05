'use client';

import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';

export default function HomePage() {
    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/github`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <ParticleBackground />
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-8">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-zinc-400">Production-ready error tracking</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            Debug production errors
                            <br />
                            <span className="text-indigo-500">directly in your IDE</span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto">
                            Surface production failures exactly where they happened in your code.
                            <br />
                            No more context switching between dashboards and editors.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <button
                                onClick={handleLogin}
                                className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-lg transition-all flex items-center gap-3"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                </svg>
                                Login with GitHub
                            </button>
                            <a
                                href="#how-it-works"
                                className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg font-semibold text-lg transition-colors"
                            >
                                See how it works
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
                            <div className="space-y-1">
                                <div className="text-3xl font-bold">&lt;100ms</div>
                                <div className="text-sm text-zinc-500">Error capture</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold">Real-time</div>
                                <div className="text-sm text-zinc-500">IDE updates</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold">Zero</div>
                                <div className="text-sm text-zinc-500">Config needed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#111111]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Built for developers
                        </h2>
                        <p className="text-xl text-zinc-400">Everything you need to debug production faster</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-indigo-600/50 transition-all">
                            <div className="w-14 h-14 bg-indigo-600/10 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">IDE Integration</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Errors appear directly in VS Code and Cursor. No context switching required.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-indigo-600/50 transition-all">
                            <div className="w-14 h-14 bg-indigo-600/10 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Sub-100ms error capture with real-time correlation to your codebase.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-indigo-600/50 transition-all">
                            <div className="w-14 h-14 bg-indigo-600/10 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Secure by Default</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Your IDE never accesses production. All data flows one-way from runtime to backend.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* How it Works */}
            <section id="how-it-works" className="relative py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold px-4">
                            Three steps to production clarity
                        </h2>
                        <p className="text-lg md:text-xl text-zinc-400">Get started in minutes, not hours</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Step 1 */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                            <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 md:p-8 h-full flex flex-col">
                                <div className="mb-6">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 md:w-7 md:h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div className="text-xs md:text-sm font-semibold text-indigo-400 mb-2 tracking-wide">STEP 1</div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-3">Install the SDK</h3>
                                </div>
                                <p className="text-zinc-400 text-sm md:text-base mb-6 flex-grow">
                                    Add our lightweight NPM package to your Node.js backend. It captures errors with zero performance impact.
                                </p>
                                <div className="bg-black/50 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm border border-zinc-800 overflow-x-auto">
                                    <div className="whitespace-nowrap">
                                        <span className="text-zinc-500">$</span>{' '}
                                        <span className="text-indigo-400">npm install</span>{' '}
                                        <span className="text-white">@rootly/sdk</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                            <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 md:p-8 h-full flex flex-col">
                                <div className="mb-6">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 md:w-7 md:h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <div className="text-xs md:text-sm font-semibold text-indigo-400 mb-2 tracking-wide">STEP 2</div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-3">Connect your repo</h3>
                                </div>
                                <p className="text-zinc-400 text-sm md:text-base mb-6 flex-grow">
                                    Link your GitHub repository through our dashboard. We map errors to exact file locations and line numbers.
                                </p>
                                <div className="flex items-center gap-3 p-3 md:p-4 bg-black/50 rounded-lg border border-zinc-800">
                                    <svg className="w-7 h-7 md:w-8 md:h-8 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                    </svg>
                                    <div className="min-w-0">
                                        <div className="font-semibold text-sm truncate">username/repo</div>
                                        <div className="text-xs text-zinc-500">Connected</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group md:col-span-2 lg:col-span-1">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                            <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 md:p-8 h-full flex flex-col">
                                <div className="mb-6">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 md:w-7 md:h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </div>
                                    <div className="text-xs md:text-sm font-semibold text-indigo-400 mb-2 tracking-wide">STEP 3</div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-3">See errors in your IDE</h3>
                                </div>
                                <p className="text-zinc-400 text-sm md:text-base mb-6 flex-grow">
                                    Install our VS Code extension. Production errors appear as inline notifications exactly where they occurred.
                                </p>
                                <div className="bg-black/50 rounded-lg p-3 md:p-4 border border-zinc-800">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-zinc-500 mb-1">checkout.ts:42</div>
                                            <div className="text-xs md:text-sm text-red-400 font-mono break-words">TypeError: Cannot read property 'id'</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#111111]">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Ready to debug faster?
                    </h2>
                    <p className="text-xl text-zinc-400">
                        Join developers who ship with confidence
                    </p>
                    <button
                        onClick={handleLogin}
                        className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-lg transition-colors"
                    >
                        Get Started for Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t border-zinc-800">
                <div className="max-w-6xl mx-auto text-center text-zinc-500 text-sm">
                    <p>© 2026 Rootly. Built for developers who care about production.</p>
                </div>
            </footer>
        </div>
    );
}
