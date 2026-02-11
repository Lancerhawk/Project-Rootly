'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ParticleBackground from '../components/ParticleBackground';

interface User {
    id: string;
    githubUsername: string;
    avatarUrl?: string;
}

interface Project {
    id: string;
    project_id: string;
    repo_full_name: string;
    platform: string;
    created_at: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; project: Project | null }>({
        show: false,
        project: null,
    });
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
                    credentials: 'include',
                });

                if (!res.ok) {
                    router.push('/');
                    return;
                }

                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        const fetchProjects = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    setProjects(data.projects);
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };

        fetchUser();
        fetchProjects();
    }, [router]);

    const handleDeleteClick = (project: Project) => {
        setDeleteModal({ show: true, project });
        setDeleteConfirmText('');
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.project || deleteConfirmText !== deleteModal.project.repo_full_name) {
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${deleteModal.project.project_id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            if (res.ok) {
                setProjects(projects.filter((p) => p.id !== deleteModal.project!.id));
                setDeleteModal({ show: false, project: null });
                setDeleteConfirmText('');
            } else {
                const data = await res.json();
                alert(data.error?.message || 'Failed to delete project');
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Failed to delete project');
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModal({ show: false, project: null });
        setDeleteConfirmText('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <ParticleBackground />
            <Navbar />

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-2">Your Projects</h1>
                        <p className="text-zinc-400 text-lg">Manage your connected repositories and monitor production errors</p>
                    </div>

                    {/* Create Project Button */}
                    <div className="mb-8">
                        <Link
                            href="/projects/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Project
                        </Link>
                    </div>

                    {/* Projects Grid */}
                    {projects.length === 0 ? (
                        <div className="text-center py-24 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm">
                            <div className="mb-6">
                                <svg className="w-20 h-20 mx-auto text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">No projects yet</h3>
                            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                                Create your first project to start monitoring production errors in your applications
                            </p>
                            <Link
                                href="/projects/new"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Your First Project
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-indigo-600/50 hover:bg-zinc-900/70 transition-all backdrop-blur-sm"
                                >
                                    {/* Repo Icon & Name */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-indigo-600/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/20 transition-colors">
                                                <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold mb-1 truncate">
                                                    {project.repo_full_name}
                                                </h3>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-800 rounded-full text-xs text-zinc-400">
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2L2 19.7778H22L12 2Z" />
                                                    </svg>
                                                    {project.platform}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteClick(project)}
                                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete project"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Project Details */}
                                    <div className="space-y-3 pt-4 border-t border-zinc-800">
                                        <div>
                                            <div className="text-xs text-zinc-500 mb-1">Project ID</div>
                                            <code className="text-xs font-mono text-indigo-400 bg-black/30 px-2 py-1 rounded">
                                                {project.project_id}
                                            </code>
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 mb-1">Created</div>
                                            <div className="text-sm text-zinc-300">
                                                {new Date(project.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && deleteModal.project && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Delete Project</h3>
                                <p className="text-sm text-zinc-400">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-zinc-300 mb-4">
                                Are you sure you want to delete <strong className="text-white">{deleteModal.project.repo_full_name}</strong>?
                            </p>
                            <p className="text-sm text-zinc-400 mb-4">
                                This will permanently delete the project and all associated data, including API keys.
                            </p>
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                                <p className="text-sm text-amber-200">
                                    To confirm, type <strong className="text-amber-100">{deleteModal.project.repo_full_name}</strong> below:
                                </p>
                            </div>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="Type repository name"
                                className="w-full px-4 py-3 bg-black/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleteConfirmText !== deleteModal.project.repo_full_name || deleting}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? 'Deleting...' : 'Delete Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
