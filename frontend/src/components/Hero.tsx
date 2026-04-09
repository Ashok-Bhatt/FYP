import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { FaPlay, FaChevronDown } from 'react-icons/fa';

const Hero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const subTextRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    
    const [currentDestination, setCurrentDestination] = useState(0);
    const destinations = ['Maldives', 'Switzerland', 'Udaipur', 'Bora Bora'];

    useEffect(() => {
        // --- Typewriter Effect ---
        const interval = setInterval(() => {
            setCurrentDestination((prev) => (prev + 1) % destinations.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [destinations.length]);

    useEffect(() => {
        if (!canvasRef.current) return;

        // --- Custom Three.js Particle Scene ---
        const scene = new THREE.Scene();
        // The background is handled by CSS aurora-bg, so we make canvas transparent
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvasRef.current, 
            alpha: true,
            antialias: true,
            powerPreference: "high-performance" 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create volumetric floating dust motes
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500; // Dense particle field
        const posArray = new Float32Array(particlesCount * 3);
        const scaleArray = new Float32Array(particlesCount);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            // Spread across a wide volume
            posArray[i] = (Math.random() - 0.5) * 15;
            if (i % 3 === 0) scaleArray[i/3] = Math.random();
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

        // Custom shader material for glowing golden/emerald particles
        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color('#10b981') }, // Emerald
                uColor2: { value: new THREE.Color('#d4af37') }  // Gold
            },
            vertexShader: `
                uniform float uTime;
                attribute float aScale;
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    // Gentle wave motion
                    modelPosition.y += sin(uTime * 0.5 + modelPosition.x * 2.0) * 0.1 * aScale;
                    modelPosition.x += cos(uTime * 0.3 + modelPosition.z * 2.0) * 0.1 * aScale;
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    gl_Position = projectedPosition;
                    // Size attenuation based on depth
                    gl_PointSize = (15.0 * aScale) * (1.0 / -viewPosition.z);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                varying vec3 vPosition;
                void main() {
                    // Soft circular particle
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 0.05 / distanceToCenter - 0.1;
                    // Mix colors based on position
                    vec3 finalColor = mix(uColor1, uColor2, sin(vPosition.x * 2.0) * 0.5 + 0.5);
                    gl_FragColor = vec4(finalColor, alpha * 0.8);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 3;

        // Mouse Parallax Interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        const onDocumentMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX - windowHalfX) * 0.001;
            mouseY = (event.clientY - windowHalfY) * 0.001;
        };
        window.addEventListener('mousemove', onDocumentMouseMove);

        const clock = new THREE.Clock();
        let animationFrameId = 0;
        let isDisposed = false;

        const animate = () => {
            if (isDisposed) return;
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            
            // Smoothly interpolate camera position toward mouse
            targetX = mouseX * 0.5;
            targetY = mouseY * 0.5;
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (-targetY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            // Update shader uniform
            particlesMaterial.uniforms.uTime.value = elapsedTime;

            // Very slow global rotation
            particlesMesh.rotation.y = elapsedTime * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            isDisposed = true;
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onDocumentMouseMove);
            scene.remove(particlesMesh);
            // Cleanup Three.js
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        // --- GSAP Entrance Animations ---
        const tl = gsap.timeline();

        // Split text animation effect manually (without SplitText plugin)
        if (textRef.current && subTextRef.current && ctaRef.current) {
            tl.fromTo(textRef.current,
                { y: 50, opacity: 0, rotateX: -30 },
                { y: 0, opacity: 1, rotateX: 0, duration: 1.5, ease: "power4.out" }
            )
            .fromTo(subTextRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
                "-=1"
            )
            .fromTo(ctaRef.current.children,
                { y: 20, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.5)" },
                "-=0.5"
            );
        }
    }, []);

    return (
        <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden aurora-bg perspective-container">
            {/* The ThreeJS Canvas Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

            {/* Glowing vignette to create depth (Cockpit window edge sensation) */}
            <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
            
            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-20">
                
                {/* Pre-heading Label */}
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs sm:text-sm font-medium text-emerald-300 tracking-wider uppercase">
                        AI-Powered Semantic Quote Engine
                    </span>
                </div>

                {/* Staggered 3D Heading */}
                <h1 ref={textRef} className="transform-3d text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                    Design the Ultimate <br className="hidden md:block"/>
                    Journey to <span className="shimmer-text">Tomorrow</span>
                </h1>

                {/* Subtext and Typewriter */}
                <div ref={subTextRef} className="mt-8 text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl font-light leading-relaxed">
                    Instantly match with premium partners and generate AI itineraries for{' '}
                    <span className="inline-block min-w-[140px] text-emerald-400 font-semibold transition-all duration-500">
                        {destinations[currentDestination]}
                    </span>
                    <br className="hidden md:block"/> in seconds. Not hours.
                </div>

                {/* CTAs */}
                <div ref={ctaRef} className="mt-12 flex flex-col items-center gap-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <Link to="/plan-journey">
                        <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] overflow-hidden">
                            <span className="relative z-10">Get My Free Quote</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </Link>
                    
                    <a href="#how-it-works" className="group flex items-center gap-3 px-8 py-4 text-white font-medium hover:text-emerald-400 transition-colors">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm group-hover:border-emerald-400/50 group-hover:bg-emerald-400/10 transition-all">
                            <FaPlay className="text-sm ml-1" />
                        </div>
                        Watch How It Works
                    </a>
                    </div>
                    <Link
                        to="/login"
                        className="text-sm font-medium text-white/55 transition-colors hover:text-white"
                    >
                        Already have an account? Login
                    </Link>
                </div>
            </div>

            {/* Orbiting Glass Cards (3D floating effect around hero) */}
            <div className="absolute top-[20%] left-[10%] hidden lg:block animate-[float_8s_ease-in-out_infinite]">
                <div className="glass-panel p-3 rounded-2xl flex items-center gap-4 transform rotate-[-5deg] border-white/20">
                    <img src="https://images.unsplash.com/photo-1626714486895-6541f53e6b72?q=80&w=150&auto=format&fit=crop" alt="Kashmir" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                        <div className="text-sm font-bold text-white">Kashmir</div>
                        <div className="text-xs text-emerald-400">98% Match</div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-[25%] right-[10%] hidden lg:block animate-[float_6s_ease-in-out_infinite_reverse]">
                <div className="glass-panel p-3 rounded-2xl flex items-center gap-4 transform rotate-[5deg] border-white/20">
                    <img src="https://images.unsplash.com/photo-1596005554384-d293674c91d7?q=80&w=150&auto=format&fit=crop" alt="Bora Bora" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                        <div className="text-sm font-bold text-white">Bora Bora</div>
                        <div className="text-xs text-emerald-400">Instant Quote</div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-70 animate-bounce">
                <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 mb-1">Scroll to fly</span>
                <FaChevronDown className="text-white text-lg" />
            </div>
        </section>
    );
};

export default Hero;
