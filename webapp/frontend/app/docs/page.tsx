'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ParticleBackground from '../components/ParticleBackground';
import Link from 'next/link';
import Image from 'next/image';

// Table of Contents sections
const tocSections = [
    { id: 'overview', title: 'Overview' },
    { id: 'quick-start', title: 'Quick Start' },
    { id: 'ide-extension', title: 'IDE Extension' },
    { id: 'platform-support', title: 'Platform Support' },
    { id: 'commit-sha', title: 'Commit SHA Detection' },
    { id: 'protection', title: 'Built-in Protection' },
    { id: 'sdk-features', title: 'SDK Features' },
    { id: 'configuration', title: 'Configuration' },
    { id: 'architecture', title: 'Architecture' },
    { id: 'api-reference', title: 'API Reference' },
    { id: 'security', title: 'Security' },
];

// Code block component with copy button
function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto border border-zinc-800">
                <pre className="text-zinc-300 whitespace-pre">{code}</pre>
            </div>
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Copy code"
            >
                {copied ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const sections = tocSections.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 150;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(tocSections[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <ParticleBackground />
            <Navbar />

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex gap-8">
                    {/* Sticky Table of Contents */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">On This Page</h3>
                            <nav className="space-y-1">
                                {tocSections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id
                                            ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                            }`}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl">
                        {/* Header */}
                        <div className="mb-16" id="overview">
                            <h1 className="text-5xl font-bold mb-4">Documentation</h1>
                            <p className="text-xl text-zinc-400">
                                Integrate Rootly in under 2 minutes.
                            </p>
                        </div>

                        {/* What Rootly Does */}
                        <section className="mb-16">
                            <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-600/20 rounded-xl p-8">
                                <h2 className="text-2xl font-bold mb-4">What Rootly Does</h2>
                                <p className="text-zinc-300 mb-4 leading-relaxed">
                                    Rootly captures unexpected production crashes and surfaces them directly inside your IDE.
                                </p>
                                <p className="text-zinc-400 mb-4 text-sm">
                                    Rootly focuses on unhandled production crashes — not logging, performance metrics, or client-side monitoring.
                                </p>
                                <div className="mb-6 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                                    <p className="text-sm text-blue-300">
                                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Rootly Runtime SDK works in Node.js environments (server-side only).
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-zinc-300">Never crashes your app</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-zinc-300">Fails silently on errors</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-zinc-300">Designed for minimal performance impact</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-zinc-300">Deduplicates noisy errors</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-zinc-300">Rate limits excessive reports</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-zinc-300">Auto-detects commit SHA</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Quick Start */}
                        <section className="mb-16" id="quick-start">
                            <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 text-sm font-bold">
                                            1
                                        </span>
                                        Install the SDK
                                    </h3>
                                    <p className="text-zinc-400 mb-4">
                                        Add the Rootly Runtime SDK to your Node.js application:
                                    </p>
                                    <CodeBlock code="npm install rootly-runtime" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 text-sm font-bold">
                                            2
                                        </span>
                                        Initialize in your code
                                    </h3>
                                    <p className="text-zinc-400 mb-4">
                                        Add this to your application entry point (e.g., <code className="bg-black/50 px-2 py-1 rounded text-sm text-indigo-400">index.ts</code> or <code className="bg-black/50 px-2 py-1 rounded text-sm text-indigo-400">server.ts</code>):
                                    </p>
                                    <CodeBlock
                                        code={`import { init } from 'rootly-runtime';

// Required: Initialize with your API key
init({
  apiKey: process.env.ROOTLY_API_KEY!
});`}
                                    />
                                    <div className="mt-4 p-4 bg-indigo-600/10 border border-indigo-600/20 rounded-lg">
                                        <p className="text-sm text-zinc-300 font-semibold mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Captured automatically:
                                        </p>
                                        <ul className="text-sm text-zinc-400 space-y-1">
                                            <li>• <code className="text-indigo-400">uncaughtException</code> - Unhandled errors</li>
                                            <li>• <code className="text-indigo-400">unhandledRejection</code> - Unhandled promise rejections</li>
                                            <li>• Express 5xx errors (when using middleware)</li>
                                            <li>• Manual <code className="text-indigo-400">capture()</code> calls</li>
                                            <li>• <code className="text-indigo-400">wrap()</code>-wrapped functions</li>
                                        </ul>
                                        <p className="text-sm text-zinc-500 mt-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Intentionally not captured: 4xx errors, handled try/catch blocks, frontend errors
                                        </p>
                                    </div>
                                    <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                        <p className="text-sm text-amber-300 font-semibold mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            Beta Notice
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                            Rootly is in active development. While we strive for reliable error capture, some errors may not be captured consistently across all platforms and scenarios. We do not guarantee 100% error detection.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 text-sm font-bold">
                                            3
                                        </span>
                                        Get Your API Key
                                    </h3>
                                    <p className="text-zinc-400 mb-4">
                                        Create a project in your dashboard to get your API key. Add it to your environment variables:
                                    </p>
                                    <CodeBlock
                                        code={`# .env
ROOTLY_API_KEY=your_api_key_here`}
                                    />
                                    <Link
                                        href="/dashboard"
                                        className="inline-block mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
                                    >
                                        Get Your API Key
                                    </Link>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 text-sm font-bold">
                                            4
                                        </span>
                                        See it in action
                                    </h3>
                                    <p className="text-zinc-400 mb-4">
                                        Test with a simple crash endpoint:
                                    </p>
                                    <CodeBlock
                                        code={`app.get('/crash', () => {
  throw new Error("Database connection failed");
});`}
                                    />
                                    <div className="mt-4 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                                        <p className="text-sm text-zinc-300 font-semibold mb-3">How it works:</p>
                                        <ol className="text-sm text-zinc-400 space-y-2">
                                            <li className="flex items-start gap-3">
                                                <span className="text-indigo-400 font-semibold">1.</span>
                                                <span>Error happens in production</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-indigo-400 font-semibold">2.</span>
                                                <span>SDK sends payload to backend</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-indigo-400 font-semibold">3.</span>
                                                <span>Backend creates incident</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-indigo-400 font-semibold">4.</span>
                                                <span>IDE extension polls and shows it</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-indigo-400 font-semibold">5.</span>
                                                <span>Click to jump to exact line in code</span>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* IDE Extension */}
                        <section className="mb-16" id="ide-extension">
                            <h2 className="text-3xl font-bold mb-6">IDE Extension</h2>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                                <p className="text-zinc-300 mb-6 leading-relaxed">
                                    The Rootly VS Code extension displays production errors directly in your editor. Click on any error to jump to the exact line of code that caused it.
                                </p>

                                {/* Extension Screenshot */}
                                <div className="mb-6 rounded-lg overflow-hidden border border-zinc-800">
                                    <Image
                                        src="/image.png"
                                        alt="Rootly VS Code Extension"
                                        width={800}
                                        height={600}
                                        className="w-full h-auto"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-black/30 rounded-lg p-4 border border-zinc-800">
                                        <h4 className="font-semibold mb-2 text-indigo-400">Real-time Notifications</h4>
                                        <p className="text-sm text-zinc-400">
                                            Get notified instantly when errors occur in production
                                        </p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4 border border-zinc-800">
                                        <h4 className="font-semibold mb-2 text-indigo-400">Jump to Code</h4>
                                        <p className="text-sm text-zinc-400">
                                            Click &quot;Go to Error Location&quot; to open the exact file and line
                                        </p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4 border border-zinc-800">
                                        <h4 className="font-semibold mb-2 text-indigo-400">Full Stack Traces</h4>
                                        <p className="text-sm text-zinc-400">
                                            View complete error details and stack traces in the sidebar
                                        </p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4 border border-zinc-800">
                                        <h4 className="font-semibold mb-2 text-indigo-400">GitHub Integration</h4>
                                        <p className="text-sm text-zinc-400">
                                            Authenticate with GitHub to access your project incidents
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <a
                                        href="https://marketplace.visualstudio.com/items?itemName=ArinJain.rootly"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                                        </svg>
                                        Install from VS Code Marketplace
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Platform Support */}
                        <section className="mb-16" id="platform-support">
                            <h2 className="text-3xl font-bold mb-6">Platform Support</h2>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                                <h3 className="text-xl font-semibold text-white mb-4">Supported Platforms</h3>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-black/50 border border-zinc-800 rounded-lg p-4">
                                        <p className="font-semibold text-white mb-1">Render</p>
                                        <p className="text-sm text-zinc-400">Node.js deployments</p>
                                    </div>
                                    <div className="bg-black/50 border border-zinc-800 rounded-lg p-4">
                                        <p className="font-semibold text-white mb-1">Railway</p>
                                        <p className="text-sm text-zinc-400">Node.js deployments</p>
                                    </div>
                                    <div className="bg-black/50 border border-zinc-800 rounded-lg p-4">
                                        <p className="font-semibold text-white mb-1">GitHub Actions</p>
                                        <p className="text-sm text-zinc-400">CI/CD pipelines</p>
                                    </div>
                                    <div className="bg-black/50 border border-zinc-800 rounded-lg p-4">
                                        <p className="font-semibold text-white mb-1">Vercel</p>
                                        <p className="text-sm text-zinc-400">Serverless functions</p>
                                    </div>
                                    <div className="bg-black/50 border border-zinc-800 rounded-lg p-4">
                                        <p className="font-semibold text-white mb-1">Traditional Node.js</p>
                                        <p className="text-sm text-zinc-400">Standard servers</p>
                                    </div>
                                    <div className="bg-black/50 border border-zinc-800 rounded-lg p-4">
                                        <p className="font-semibold text-white mb-1">Custom</p>
                                        <p className="text-sm text-zinc-400">Any Node.js environment</p>
                                    </div>
                                </div>

                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Beta Testing Phase
                                    </h4>
                                    <p className="text-sm text-zinc-300 mb-3">
                                        Rootly is currently in active development and beta testing. Error capture reliability varies across platforms and error types.
                                    </p>
                                    <ul className="text-sm text-zinc-400 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-0.5">•</span>
                                            <span>Some errors may not be captured consistently</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-0.5">•</span>
                                            <span>Manual <code className="px-1.5 py-0.5 bg-black/50 border border-zinc-700 rounded text-indigo-400 text-xs">capture()</code> is most reliable across all platforms</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-0.5">•</span>
                                            <span>We do not guarantee 100% error detection</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-0.5">•</span>
                                            <span>Continuous improvements are being made to enhance reliability</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Commit SHA Detection */}
                        <section className="mb-16" id="commit-sha">
                            <h2 className="text-3xl font-bold mb-6">Automatic Commit SHA Detection</h2>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                                <p className="text-zinc-300 mb-4 leading-relaxed">
                                    Rootly automatically detects your deployment commit SHA from environment variables. <strong className="text-white">No configuration required</strong> on popular platforms.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-black/30 rounded-lg p-4 border border-zinc-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                            </svg>
                                            <span className="font-semibold">Vercel</span>
                                        </div>
                                        <code className="text-xs text-zinc-500">VERCEL_GIT_COMMIT_SHA</code>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4 border border-zinc-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                            </svg>
                                            <span className="font-semibold">GitHub Actions</span>
                                        </div>
                                        <code className="text-xs text-zinc-500">GITHUB_SHA</code>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4 border border-zinc-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                            </svg>
                                            <span className="font-semibold">Render</span>
                                        </div>
                                        <code className="text-xs text-zinc-500">RENDER_GIT_COMMIT</code>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4 border border-zinc-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                            <span className="font-semibold">Custom</span>
                                        </div>
                                        <code className="text-xs text-zinc-500">COMMIT_SHA</code>
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-500 mt-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    The commit SHA enables IDE jump-to-code functionality by matching errors to exact file versions.
                                </p>
                            </div>
                        </section>

                        {/* Built-in Protection */}
                        <section className="mb-16" id="protection">
                            <h2 className="text-3xl font-bold mb-6">Built-in Protection</h2>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                                <p className="text-zinc-300 mb-6 leading-relaxed">
                                    Rootly automatically deduplicates repeated errors and rate limits excessive reports to protect your app and backend.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-black/30 rounded-lg p-6 border border-zinc-800">
                                        <h4 className="font-semibold mb-3 text-indigo-400 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Deduplication
                                        </h4>
                                        <p className="text-sm text-zinc-400">
                                            Identical errors within a <strong className="text-white">10-second window</strong> are automatically deduplicated to prevent noise.
                                        </p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-6 border border-zinc-800">
                                        <h4 className="font-semibold mb-3 text-indigo-400 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Rate Limiting
                                        </h4>
                                        <p className="text-sm text-zinc-400">
                                            Maximum <strong className="text-white">20 errors per minute</strong> to prevent overwhelming your backend during cascading failures.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SDK Features */}
                        <section className="mb-16" id="sdk-features">
                            <h2 className="text-3xl font-bold mb-6">SDK Features (v1.2.3)</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Production Hardening */}
                                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-indigo-600/50 transition-all">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Production Hardening</h3>
                                            <ul className="space-y-2 text-sm text-zinc-400">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Environment normalization with NODE_ENV fallback</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Severity support (error/warning/info)</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Recursive capture protection</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Stable fingerprinting algorithm</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance */}
                                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-indigo-600/50 transition-all">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Performance Optimized</h3>
                                            <ul className="space-y-2 text-sm text-zinc-400">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Hard memory cap (500 max fingerprints)</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Optimized rate limiter (O(n) performance)</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Graceful shutdown request draining</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Zero dependencies</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Automatic Capture */}
                                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-indigo-600/50 transition-all">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Automatic Capture</h3>
                                            <ul className="space-y-2 text-sm text-zinc-400">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Uncaught exceptions</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Unhandled promise rejections</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Express 5xx errors (middleware)</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Function wrapping (wrap API)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Production Safety */}
                                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-indigo-600/50 transition-all">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Production Safety</h3>
                                            <ul className="space-y-2 text-sm text-zinc-400">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Fail-silent (never crashes app)</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Error deduplication (10s window)</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Rate limiting (20 errors/60s)</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    <span>Auto-detects commit SHA</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Optional Configuration */}
                        <section className="mb-16" id="configuration">
                            <h2 className="text-3xl font-bold mb-6">Optional Configuration</h2>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-indigo-400">Environment</h3>
                                    <p className="text-zinc-400 mb-4">
                                        Specify your environment (defaults to <code className="bg-black/50 px-2 py-1 rounded text-sm text-indigo-400">NODE_ENV</code>):
                                    </p>
                                    <CodeBlock
                                        code={`init({
  apiKey: process.env.ROOTLY_API_KEY!,
  environment: 'production' // or 'preview'
});`}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-indigo-400">Debug Mode</h3>
                                    <p className="text-zinc-400 mb-4">
                                        Enable debug logging to stderr for troubleshooting:
                                    </p>
                                    <CodeBlock
                                        code={`init({
  apiKey: process.env.ROOTLY_API_KEY!,
  debug: true // Shows dedup, rate limiting, send events
});`}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-indigo-400">Manual Error Capture</h3>
                                    <p className="text-zinc-400 mb-4">
                                        Capture handled errors with custom context and severity:
                                    </p>
                                    <CodeBlock
                                        code={`import { capture } from 'rootly-runtime';

try {
  // Your code...
} catch (error) {
  capture(error, { 
    user_id: '123',
    action: 'checkout' 
  }, 'error'); // severity: 'error' | 'warning' | 'info'
}`}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-indigo-400">Express Middleware</h3>
                                    <p className="text-zinc-400 mb-4">
                                        Automatically capture 5xx errors in Express apps:
                                    </p>
                                    <CodeBlock
                                        code={`import { expressErrorHandler } from 'rootly-runtime';

// Add BEFORE your final error handler
app.use(expressErrorHandler());

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});`}
                                    />
                                    <div className="mt-4 p-4 bg-amber-600/10 border border-amber-600/20 rounded-lg">
                                        <p className="text-sm text-zinc-300 flex items-start gap-2">
                                            <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span><strong>Important:</strong> This middleware captures <strong className="text-white">only 5xx errors</strong>. It does <strong className="text-white">NOT</strong> capture 4xx errors (validation, auth, etc.).</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Architecture */}
                        <section className="mb-16" id="architecture">
                            <h2 className="text-3xl font-bold mb-6">Architecture</h2>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                                <p className="text-zinc-300 mb-6 leading-relaxed">
                                    Rootly closes the loop between production failures and your editor.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-black/30 rounded-lg p-6 border border-zinc-800">
                                        <h4 className="font-semibold mb-3 text-indigo-400">Runtime SDK (v1.2.3)</h4>
                                        <p className="text-sm text-zinc-400">
                                            NPM package with zero dependencies. Captures errors with deduplication, rate limiting, and graceful shutdown. Fail-silent design never crashes your app.
                                        </p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-6 border border-zinc-800">
                                        <h4 className="font-semibold mb-3 text-indigo-400">Backend Service</h4>
                                        <p className="text-sm text-zinc-400">
                                            Node.js API that receives error telemetry, parses stack traces, and correlates errors to exact file locations and line numbers.
                                        </p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-6 border border-zinc-800">
                                        <h4 className="font-semibold mb-3 text-indigo-400">Web Dashboard</h4>
                                        <p className="text-sm text-zinc-400">
                                            Project setup and management interface. Connect your GitHub repositories and generate API keys for your applications.
                                        </p>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-6 border border-zinc-800">
                                        <h4 className="font-semibold mb-3 text-indigo-400">IDE Extension</h4>
                                        <p className="text-sm text-zinc-400">
                                            VS Code/Cursor extension that polls for incidents and displays them directly in your editor at the exact line where errors occurred.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* API Reference */}
                        <section className="mb-16" id="api-reference">
                            <h2 className="text-3xl font-bold mb-6">API Reference</h2>
                            <div className="space-y-4">
                                <details className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
                                    <summary className="px-8 py-6 cursor-pointer hover:bg-zinc-800/50 transition-colors font-semibold flex items-center justify-between">
                                        <span>init(options)</span>
                                        <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-8 pb-6 text-zinc-300 space-y-4">
                                        <p className="text-sm">Initialize the SDK. Must be called before other functions.</p>
                                        <CodeBlock
                                            code={`interface InitOptions {
  apiKey: string;        // Required: Your Rootly API key
  environment?: string;  // Optional: 'production' or 'preview' (default: NODE_ENV)
  debug?: boolean;       // Optional: Enable debug logging (default: false)
}`}
                                        />
                                    </div>
                                </details>

                                <details className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
                                    <summary className="px-8 py-6 cursor-pointer hover:bg-zinc-800/50 transition-colors font-semibold flex items-center justify-between">
                                        <span>capture(error, context?, severity?)</span>
                                        <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-8 pb-6 text-zinc-300 space-y-4">
                                        <p className="text-sm">Manually capture an error with optional context and severity.</p>
                                        <CodeBlock
                                            code={`capture(
  error: Error,
  extraContext?: object,
  severity?: 'error' | 'warning' | 'info'
): void

// Example
capture(new Error('Payment failed'), { 
  user_id: '123',
  amount: 99.99 
}, 'error');`}
                                        />
                                    </div>
                                </details>

                                <details className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
                                    <summary className="px-8 py-6 cursor-pointer hover:bg-zinc-800/50 transition-colors font-semibold flex items-center justify-between">
                                        <span>wrap(fn)</span>
                                        <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-8 pb-6 text-zinc-300 space-y-4">
                                        <p className="text-sm">Wrap a function to automatically capture errors. Works with sync and async functions.</p>
                                        <CodeBlock
                                            code={`wrap<T>(fn: T): T

// Example
const safeFunction = wrap(async (userId: string) => {
  const user = await fetchUser(userId);
  return user;
});`}
                                        />
                                    </div>
                                </details>

                                <details className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
                                    <summary className="px-8 py-6 cursor-pointer hover:bg-zinc-800/50 transition-colors font-semibold flex items-center justify-between">
                                        <span>expressErrorHandler()</span>
                                        <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-8 pb-6 text-zinc-300 space-y-4">
                                        <p className="text-sm">Express middleware for capturing 5xx errors. Place before your final error handler.</p>
                                        <CodeBlock
                                            code={`app.use(expressErrorHandler());

// Captures errors when res.statusCode >= 500
// Ignores 4xx errors (validation, auth, etc.)
// Always calls next(err) to continue error chain`}
                                        />
                                    </div>
                                </details>
                            </div>
                        </section>

                        {/* Security */}
                        <section className="mb-16" id="security">
                            <h2 className="text-3xl font-bold mb-6">Security</h2>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-2 text-indigo-400">Data Isolation</h4>
                                    <p className="text-sm text-zinc-400">
                                        Users can ONLY access data for projects they own. All queries are scoped to the authenticated user&apos;s projects.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-indigo-400">API Key Security</h4>
                                    <p className="text-sm text-zinc-400">
                                        API keys are shown only once during project creation. They are hashed before storage and validated using constant-time comparison to prevent timing attacks.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-indigo-400">SDK Safety</h4>
                                    <p className="text-sm text-zinc-400">
                                        The SDK is fail-silent and never crashes your application. All operations are wrapped in try-catch blocks. Network failures are silent.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Support */}
                        <section>
                            <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-600/20 rounded-xl p-8 text-center">
                                <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
                                <p className="text-zinc-300 mb-6">
                                    Check out our GitHub repository for more examples and community support.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Link
                                        href="/dashboard"
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                    <a
                                        href="https://github.com/Lancerhawk/Project-Rootly"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-semibold transition-colors"
                                    >
                                        View on GitHub
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
