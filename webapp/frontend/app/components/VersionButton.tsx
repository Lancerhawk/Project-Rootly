'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Feature {
    title: string;
    description: string;
    status: 'completed' | 'planned';
}

interface Version {
    version: string;
    name: string;
    releaseDate: string;
    status: 'current' | 'planned' | 'implemented';
    description: string;
    features: Feature[];
    technicalDetails: Record<string, string[]>;
}

interface VersionData {
    currentVersion: string;
    versions: Version[];
}

export default function VersionButton() {
    const [showModal, setShowModal] = useState(false);
    const [versionData, setVersionData] = useState<VersionData | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

    useEffect(() => {
        // Load version data
        fetch('/versions.json')
            .then((res) => res.json())
            .then((data: VersionData) => {
                setVersionData(data);
                // Set current version as default
                const current = data.versions.find((v) => v.status === 'current');
                if (current) setSelectedVersion(current);
            })
            .catch((err) => console.error('Failed to load version data:', err));
    }, []);

    const handleVersionSelect = (version: Version) => {
        setSelectedVersion(version);
    };

    const handlePlannedSelect = (planned: Version) => {
        setSelectedVersion(planned);
    };

    if (!versionData) return null;

    const implementedVersions = versionData.versions.filter((v) => v.status === 'current' || v.status === 'implemented');
    const plannedFeatures = versionData.versions.filter((v) => v.status === 'planned');

    return (
        <>
            {/* Floating Version Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-6 right-6 w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-600/50 rounded-full flex items-center justify-center transition-all shadow-lg z-40 group"
                title="Version Info"
            >
                <svg className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Version Modal */}
            {showModal && selectedVersion && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between p-8 border-b border-zinc-800 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <Image src="/icon.svg" alt="Rootly" width={48} height={48} className="w-12 h-12" />
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Rootly</h3>
                                    <p className="text-sm text-indigo-400 font-semibold">Version {versionData.currentVersion}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-1 overflow-hidden min-h-0">
                            {/* Sidebar */}
                            <div className="w-72 border-r border-zinc-800 flex flex-col flex-shrink-0">
                                {/* Implemented Versions - Takes more space */}
                                <div className="p-4 flex-1 flex flex-col overflow-hidden min-h-0 border-b border-zinc-800">
                                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-2 flex-shrink-0">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Version History
                                    </h4>
                                    <div className="space-y-2 overflow-y-auto pr-2">
                                        {implementedVersions.map((version) => (
                                            <button
                                                key={version.version}
                                                onClick={() => handleVersionSelect(version)}
                                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedVersion.version === version.version && (selectedVersion.status === 'current' || selectedVersion.status === 'implemented')
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-sm">v{version.version}</span>
                                                    {version.status === 'current' && (
                                                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase font-bold rounded">Current</span>
                                                    )}
                                                </div>
                                                <div className="text-xs opacity-75 truncate">{version.name}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Planned Features - Takes less space */}
                                <div className="p-4 h-[220px] flex flex-col overflow-hidden flex-shrink-0 bg-zinc-900/50">
                                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-2 flex-shrink-0">
                                        <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Coming Soon
                                    </h4>
                                    <div className="space-y-3 overflow-y-auto pr-2">
                                        {plannedFeatures.map((feature, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handlePlannedSelect(feature)}
                                                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${selectedVersion.version === feature.version && selectedVersion.status === 'planned'
                                                    ? 'bg-amber-600/20 border-amber-600/50'
                                                    : 'bg-zinc-800/30 border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <svg className="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-zinc-400">{feature.name}</span>
                                                </div>
                                                <p className="text-xs text-zinc-600 truncate">{feature.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            {/* Content Area - Shows selected version details */}
                            <div className="flex-1 p-8 overflow-y-auto min-h-0">
                                <div className="space-y-6">
                                    {/* Version Header */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-2xl font-bold text-white">{selectedVersion.name}</h4>
                                            {(selectedVersion.status === 'current' || selectedVersion.status === 'implemented') ? (
                                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${selectedVersion.status === 'current' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-300'}`}>
                                                    v{selectedVersion.version} {selectedVersion.status === 'current' && '• Current'}
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
                                                    Planned
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-zinc-400 mb-2">{selectedVersion.description}</p>
                                        <p className="text-sm text-zinc-500">
                                            {(selectedVersion.status === 'current' || selectedVersion.status === 'implemented') ? 'Released' : 'Expected'}: {selectedVersion.releaseDate}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <h5 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                                            {(selectedVersion.status === 'current' || selectedVersion.status === 'implemented') ? "What's Included" : 'Planned Features'}
                                        </h5>
                                        <div className="space-y-3">
                                            {selectedVersion.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    {(selectedVersion.status === 'current' || selectedVersion.status === 'implemented') ? (
                                                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                    <div>
                                                        <p className={`text-sm font-medium ${(selectedVersion.status === 'current' || selectedVersion.status === 'implemented') ? 'text-white' : 'text-zinc-300'}`}>
                                                            {feature.title}
                                                        </p>
                                                        <p className={`text-xs ${(selectedVersion.status === 'current' || selectedVersion.status === 'implemented') ? 'text-zinc-500' : 'text-zinc-600'}`}>
                                                            {feature.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Technical Details */}
                                    {Object.keys(selectedVersion.technicalDetails).length > 0 && (
                                        <div>
                                            <h5 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Technical Stack</h5>
                                            <div className="space-y-3">
                                                {Object.entries(selectedVersion.technicalDetails).map(([category, items]) => (
                                                    <div key={category}>
                                                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2 capitalize">{category}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {items.map((item, idx) => (
                                                                <span key={idx} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full">
                                                                    {item}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
