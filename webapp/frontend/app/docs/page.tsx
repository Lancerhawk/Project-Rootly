'use client';

import Navbar from '../components/Navbar';
import ParticleBackground from '../components/ParticleBackground';
import Link from 'next/link';

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <ParticleBackground />
            <Navbar />

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-16">
                        <h1 className="text-5xl font-bold mb-4">Documentation</h1>
                        <p className="text-xl text-zinc-400">
                            Everything you need to integrate Rootly into your application
                        </p>
                    </div>

                    {/* Quick Start */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 text-sm font-bold">
                                        1
                                    </span>
                                    Install the SDK
                                </h3>
                                <p className="text-zinc-400 mb-4">
                                    Add the Rootly SDK to your Node.js application:
                                </p>
                                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                                    <span className="text-zinc-500">$</span>{' '}
                                    <span className="text-indigo-400">npm install</span>{' '}
                                    <span className="text-white">@rootly/sdk</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 text-sm font-bold">
                                        2
                                    </span>
                                    Initialize in your code
                                </h3>
                                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    <pre className="text-zinc-300">
                                        {`import { Rootly } from '@rootly/sdk';

const rootly = new Rootly({
  projectId: process.env.ROOTLY_PROJECT_ID,
  apiKey: process.env.ROOTLY_API_KEY,
});

// Errors are automatically captured
rootly.captureErrors();`}
                                    </pre>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 text-sm font-bold">
                                        3
                                    </span>
                                    Install IDE Extension
                                </h3>
                                <p className="text-zinc-400 mb-4">
                                    Install the Rootly extension for VS Code or Cursor to see errors directly in your editor.
                                </p>
                                <Link
                                    href="/dashboard"
                                    className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
                                >
                                    Get Your API Keys
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Architecture */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6">Architecture</h2>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                            <p className="text-zinc-300 mb-6 leading-relaxed">
                                Rootly is a production-grade developer tooling platform that helps engineers understand WHY production failures happened and WHERE they originated in code.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-black/30 rounded-lg p-6">
                                    <h4 className="font-semibold mb-3 text-indigo-400">Runtime SDK</h4>
                                    <p className="text-sm text-zinc-400">
                                        Lightweight NPM package that runs in your production environment. Captures errors with zero performance impact and sends telemetry to the backend.
                                    </p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-6">
                                    <h4 className="font-semibold mb-3 text-indigo-400">Backend Service</h4>
                                    <p className="text-sm text-zinc-400">
                                        Node.js API that receives error telemetry, parses stack traces, and correlates errors to exact file locations and line numbers.
                                    </p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-6">
                                    <h4 className="font-semibold mb-3 text-indigo-400">Web Dashboard</h4>
                                    <p className="text-sm text-zinc-400">
                                        Project setup and management interface. Connect your GitHub repositories and generate API keys for your applications.
                                    </p>
                                </div>
                                <div className="bg-black/30 rounded-lg p-6">
                                    <h4 className="font-semibold mb-3 text-indigo-400">IDE Extension</h4>
                                    <p className="text-sm text-zinc-400">
                                        VS Code/Cursor extension that polls for incidents and displays them directly in your editor at the exact line where errors occurred.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* API Reference */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6">API Reference</h2>
                        <div className="space-y-4">
                            <details className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                                <summary className="px-8 py-6 cursor-pointer hover:bg-zinc-800/50 transition-colors font-semibold">
                                    Authentication
                                </summary>
                                <div className="px-8 pb-6 text-zinc-300 space-y-4">
                                    <p>Rootly uses two authentication methods:</p>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li><strong>GitHub OAuth</strong> - For dashboard and IDE extension (user authentication)</li>
                                        <li><strong>API Keys</strong> - For SDK (ingest authentication)</li>
                                    </ul>
                                </div>
                            </details>

                            <details className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                                <summary className="px-8 py-6 cursor-pointer hover:bg-zinc-800/50 transition-colors font-semibold">
                                    POST /api/ingest
                                </summary>
                                <div className="px-8 pb-6 text-zinc-300 space-y-4">
                                    <p className="text-sm">Receive error telemetry from the SDK.</p>
                                    <div className="bg-black/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                                        <pre>{`Authorization: Bearer <ingest_api_key>

{
  "error": {
    "message": "Cannot read property 'id' of undefined",
    "type": "TypeError",
    "stack": "TypeError: Cannot read property...\\n  at checkout.ts:42:10"
  },
  "context": {
    "commit_sha": "a1b2c3d4e5f6",
    "environment": "production",
    "occurred_at": "2026-02-06T02:30:00Z"
  }
}`}</pre>
                                    </div>
                                </div>
                            </details>

                            <details className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                                <summary className="px-8 py-6 cursor-pointer hover:bg-zinc-800/50 transition-colors font-semibold">
                                    GET /api/incidents
                                </summary>
                                <div className="px-8 pb-6 text-zinc-300 space-y-4">
                                    <p className="text-sm">Query incidents for a repository (used by IDE extension).</p>
                                    <div className="bg-black/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                                        <pre>{`GET /api/incidents?repo=owner/repo&status=open&limit=10
Authorization: Bearer <user_token>

Response:
{
  "incidents": [{
    "id": "inc_xyz789",
    "error_message": "Cannot read property 'id' of undefined",
    "file_path": "src/handlers/checkout.ts",
    "line_number": 42,
    "status": "open"
  }]
}`}</pre>
                                    </div>
                                </div>
                            </details>

                            <details className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                                <summary className="px-8 py-6 cursor-pointer hover:bg-zinc-800/50 transition-colors font-semibold">
                                    POST /api/projects
                                </summary>
                                <div className="px-8 pb-6 text-zinc-300 space-y-4">
                                    <p className="text-sm">Create a new project and get API keys.</p>
                                    <div className="bg-black/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                                        <pre>{`POST /api/projects
Authorization: Bearer <user_token>

{
  "repo_owner": "username",
  "repo_name": "my-app",
  "platform": "vercel"
}

Response:
{
  "project": {
    "id": "proj_abc123",
    "ingest_api_key": "key_xyz789_SHOW_ONCE"
  }
}`}</pre>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </section>

                    {/* Security */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6">Security</h2>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2 text-indigo-400">Data Isolation</h4>
                                <p className="text-sm text-zinc-400">
                                    Users can ONLY access data for projects they own. All queries are scoped to the authenticated user's projects.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 text-indigo-400">API Key Security</h4>
                                <p className="text-sm text-zinc-400">
                                    API keys are shown only once during project creation. They are hashed before storage and validated using constant-time comparison to prevent timing attacks.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 text-indigo-400">IDE Extension</h4>
                                <p className="text-sm text-zinc-400">
                                    The IDE extension is read-only and never writes to production. It polls the backend every 30-60 seconds using user authentication tokens.
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
                                    href="https://github.com"
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
    );
}
