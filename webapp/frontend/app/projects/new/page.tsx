'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ParticleBackground from '../../components/ParticleBackground';

interface Repo {
    full_name: string;
    name: string;
    owner: string;
    private: boolean;
    description?: string;
}

interface CreatedProject {
    id: string;
    project_id: string;
    repo_full_name: string;
    platform: string;
    ingest_api_key: string;
    created_at: string;
}

export default function NewProjectPage() {
    const router = useRouter();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [selectedRepo, setSelectedRepo] = useState('');
    const [platform] = useState('vercel');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [createdProject, setCreatedProject] = useState<CreatedProject | null>(null);
    const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchRepos();
    }, []);

    const fetchRepos = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/github/repos`, {
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Failed to fetch repositories');
            }

            const data = await res.json();
            setRepos(data.repos);
        } catch (error) {
            console.error('Failed to fetch repos:', error);
            setError('Failed to load repositories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRepo) {
            setError('Please select a repository');
            return;
        }

        setCreating(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    repo_full_name: selectedRepo,
                    platform,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || 'Failed to create project');
            }

            setCreatedProject(data.project);
        } catch (error: any) {
            console.error('Failed to create project:', error);
            setError(error.message || 'Failed to create project');
        } finally {
            setCreating(false);
        }
    };

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopied({ ...copied, [key]: true });
        setTimeout(() => {
            setCopied({ ...copied, [key]: false });
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white text-lg">Loading repositories...</div>
            </div>
        );
    }

    if (createdProject) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <ParticleBackground />
                <Navbar />

                <div className="pt-32 pb-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Success Animation */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600/20 rounded-full mb-6">
                                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold mb-3">Project Created Successfully!</h1>
                            <p className="text-zinc-400 text-lg">Your project is ready to start capturing errors</p>
                        </div>

                        {/* Warning Alert */}
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8">
                            <div className="flex gap-4">
                                <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-amber-500 mb-1">Important: Save These Credentials</h3>
                                    <p className="text-sm text-amber-200/80">
                                        You won't be able to see the API key again after leaving this page. Make sure to copy and save it securely.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Credentials Cards */}
                        <div className="space-y-6 mb-12">
                            {/* Project ID */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <label className="block text-sm font-medium text-zinc-400 mb-3">
                                    Project ID
                                </label>
                                <div className="flex gap-3">
                                    <code className="flex-1 bg-black/50 border border-zinc-800 px-4 py-3 rounded-lg font-mono text-sm text-indigo-400">
                                        {createdProject.project_id}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(createdProject.project_id, 'projectId')}
                                        className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
                                    >
                                        {copied.projectId ? (
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* API Key */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <label className="block text-sm font-medium text-zinc-400 mb-3">
                                    Ingest API Key
                                </label>
                                <div className="flex gap-3">
                                    <code className="flex-1 bg-black/50 border border-zinc-800 px-4 py-3 rounded-lg font-mono text-sm text-pink-400 break-all">
                                        {createdProject.ingest_api_key}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(createdProject.ingest_api_key, 'apiKey')}
                                        className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
                                    >
                                        {copied.apiKey ? (
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
                            <h3 className="text-xl font-semibold mb-6">Next Steps</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 font-semibold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Add to Environment Variables</h4>
                                        <p className="text-sm text-zinc-400">
                                            Add these credentials to your <code className="px-2 py-0.5 bg-black/50 rounded text-indigo-400">.env</code> file
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 font-semibold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Install the SDK</h4>
                                        <p className="text-sm text-zinc-400 mb-2">
                                            Run <code className="px-2 py-0.5 bg-black/50 rounded text-indigo-400">npm install @rootly/sdk</code> in your project
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 font-semibold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Deploy and Test</h4>
                                        <p className="text-sm text-zinc-400">
                                            Deploy your application and start capturing production errors!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Link
                                href="/dashboard"
                                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-center transition-colors"
                            >
                                Go to Dashboard
                            </Link>
                            <Link
                                href="/docs"
                                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg font-semibold text-center transition-colors"
                            >
                                View Documentation
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <ParticleBackground />
            <Navbar />

            <div className="pt-40 pb-20 px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold mb-3">Create New Project</h1>
                        <p className="text-zinc-400 text-lg">Connect a GitHub repository to start tracking errors</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleCreateProject} className="space-y-8">
                        {/* Repository Selection */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                            <label className="block text-sm font-medium text-zinc-300 mb-4">
                                Select Repository
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedRepo}
                                    onChange={(e) => setSelectedRepo(e.target.value)}
                                    className="w-full px-4 py-3 pr-10 bg-black/50 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" className="bg-zinc-900">Choose a repository...</option>
                                    {repos.map((repo) => (
                                        <option key={repo.full_name} value={repo.full_name} className="bg-zinc-900">
                                            {repo.full_name} {repo.private ? '(Private)' : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-zinc-500">
                                Select the GitHub repository you want to monitor for production errors
                            </p>
                        </div>

                        {/* Platform */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                            <label className="block text-sm font-medium text-zinc-300 mb-4">
                                Deployment Platform
                            </label>
                            <div className="flex items-center justify-between px-4 py-3 bg-black/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2L2 19.7778H22L12 2Z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Vercel</span>
                                </div>
                                <span className="text-sm text-zinc-500">Only platform supported in MVP</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={creating || !selectedRepo}
                            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                        >
                            {creating ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Project...
                                </span>
                            ) : (
                                'Create Project'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
