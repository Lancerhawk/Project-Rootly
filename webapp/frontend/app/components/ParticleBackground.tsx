'use client';

import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
}

export default function ParticleBackground() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const newParticles: Particle[] = [];
        // Increased from 50 to 150 particles
        for (let i = 0; i < 150; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 1, // Slightly larger particles
                delay: Math.random() * 5,
                duration: Math.random() * 10 + 10,
            });
        }
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-indigo-500/30 particle" // Increased opacity from /20 to /30
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}
