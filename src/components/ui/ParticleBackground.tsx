import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    life: number; maxLife: number;
    size: number;
    color: string;
    opacity: number;
    decay: number;
}

const COLORS = [
    'rgba(255, 69, 0, 0.8)',    // Orange-red
    'rgba(255, 140, 0, 0.7)',   // Dark orange
    'rgba(255, 215, 0, 0.6)',   // Gold
    'rgba(255, 99, 71, 0.5)',   // Tomato
    'rgba(255, 165, 0, 0.7)',   // Orange
];

const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const animRef = useRef<number>(0);
    const mousePosition = useRef({ x: 0, y: 0 });
    const connectionDistance = 100;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Mouse tracking for interactive particles
        const handleMouseMove = (e: MouseEvent) => {
            mousePosition.current = {
                x: e.clientX,
                y: e.clientY
            };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Enhanced particle creation
        const spawnParticle = () => {
            // Random particles from bottom
            if (Math.random() > 0.3) {
                const x = Math.random() * canvas.width;
                const y = canvas.height + 10;
                particles.current.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: -(Math.random() * 1.5 + 0.5),
                    life: 0,
                    maxLife: 120 + Math.random() * 80,
                    size: Math.random() * 2 + 1,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    opacity: 0.3 + Math.random() * 0.4,
                    decay: 0.98 + Math.random() * 0.02,
                });
            }

            // Occasional particles from sides for variety
            if (Math.random() > 0.7) {
                const side = Math.random() > 0.5 ? 'left' : 'right';
                const x = side === 'left' ? -10 : canvas.width + 10;
                const y = Math.random() * canvas.height;
                particles.current.push({
                    x, y,
                    vx: side === 'left' ? Math.random() * 0.5 + 0.2 : -(Math.random() * 0.5 + 0.2),
                    vy: (Math.random() - 0.5) * 0.3,
                    life: 0,
                    maxLife: 150 + Math.random() * 100,
                    size: Math.random() * 1.5 + 0.5,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    opacity: 0.2 + Math.random() * 0.3,
                    decay: 0.99 + Math.random() * 0.01,
                });
            }
        };

        // Draw connections between nearby particles
        const drawConnections = () => {
            if (!ctx) return;

            for (let i = 0; i < particles.current.length; i++) {
                for (let j = i + 1; j < particles.current.length; j++) {
                    const p1 = particles.current[i];
                    const p2 = particles.current[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const alpha = (1 - distance / connectionDistance) * 0.2;
                        ctx.globalAlpha = alpha;
                        ctx.strokeStyle = 'rgba(255, 69, 0, 0.3)';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Connection to mouse
                const mouseDx = p1.x - mousePosition.current.x;
                const mouseDy = p1.y - mousePosition.current.y;
                const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

                if (mouseDistance < connectionDistance * 1.5) {
                    const alpha = (1 - mouseDistance / (connectionDistance * 1.5)) * 0.15;
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mousePosition.current.x, mousePosition.current.y);
                    ctx.stroke();
                }
            }
            ctx.globalAlpha = 1;
        };

        // Main animation loop
        let frame = 0;
        const loop = () => {
            if (!ctx) return;

            // Semi-transparent clear for trail effect
            ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            frame++;
            if (frame % 2 === 0) spawnParticle();

            // Update and draw particles
            particles.current = particles.current.filter(p => {
                p.life++;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02; // Gravity
                p.opacity *= p.decay;

                // Mouse interaction
                const mouseDx = p.x - mousePosition.current.x;
                const mouseDy = p.y - mousePosition.current.y;
                const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

                if (mouseDistance < 100) {
                    const force = (100 - mouseDistance) / 100;
                    p.vx += (mouseDx / mouseDistance) * force * 0.5;
                    p.vy += (mouseDy / mouseDistance) * force * 0.5;
                }

                // Draw particle
                if (p.life < p.maxLife && p.opacity > 0.01) {
                    ctx.globalAlpha = p.opacity;
                    ctx.fillStyle = p.color;
                    ctx.shadowBlur = p.size * 3;
                    ctx.shadowColor = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    return true;
                }
                return false;
            });

            // Draw connections
            drawConnections();

            ctx.globalAlpha = 1;
            animRef.current = requestAnimationFrame(loop);
        };

        animRef.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default ParticleBackground;
