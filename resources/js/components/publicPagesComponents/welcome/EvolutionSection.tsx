import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function EvolutionSection() {
    /*
    |----------------------------------------------------------------
    | GSAP
    |----------------------------------------------------------------
    */

    const container = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const bgOverlayRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Su mobile riduciamo leggermente la durata dello scroll per non stancare il pollice
            const isMobile = window.innerWidth < 768;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top top',
                    end: isMobile ? '+=1200' : '+=3000',
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            tl.to(textRef.current, {
                scale: 0.8,
                opacity: 0,
                filter: isMobile ? 'blur(4px)' : 'blur(10px)',
                duration: 1,
            })
                .from('.step-1', { y: 50, opacity: 0, duration: 1 }, '-=0.5')
                .to('.step-1', {
                    opacity: 0,
                    y: -50,
                    scale: 1.1,
                    duration: 1,
                    delay: 0.8,
                })

                // STEP 2: Colore ON
                .to(bgOverlayRef.current, { opacity: 1, duration: 1 }, '-=0.3')
                .from('.step-2', { scale: 0.9, opacity: 0, duration: 1 }, '<')
                .to('.step-2', {
                    opacity: 0,
                    scale: 1.1,
                    duration: 1,
                    delay: 0.8,
                })

                // STEP 2: Colore OFF
                .to(bgOverlayRef.current, { opacity: 0, duration: 1 }, '-=0.5')

                // STEP 3
                .from('.step-3', { opacity: 0, scale: 1.5, duration: 1 }, '<')
                .to('.step-3', { scale: 1.2, duration: 2 });
        },
        { scope: container },
    );

    /*
    |----------------------------------------------------------------
    | Render
    |----------------------------------------------------------------
    */

    return (
        <section
            ref={container}
            className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-500"
        >
            {/* 1. Grid Background - Ottimizzata */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-10 md:opacity-20" />

            {/* 2. Overlay Colorato */}
            <div
                ref={bgOverlayRef}
                className="z-1 pointer-events-none absolute inset-0 bg-foreground/10 opacity-0"
            />

            <div className="relative z-10 w-full px-4 text-center">
                {/* Main Title - Responsive sizing */}
                <h2
                    ref={textRef}
                    className="text-6xl font-black uppercase leading-none tracking-tighter sm:text-8xl md:text-[12rem]"
                >
                    Evolution<span className="text-primary">_</span>
                </h2>

                {/* Animated Steps Wrapper */}
                <div className="absolute inset-0 flex items-center justify-center px-4">
                    <div className="step-1 pointer-events-none absolute w-full text-3xl font-light italic tracking-tight sm:text-4xl md:text-6xl">
                        Deadly Accurate
                    </div>

                    <div className="step-2 pointer-events-none absolute w-full text-4xl font-black uppercase tracking-tight text-primary sm:text-6xl md:text-8xl md:tracking-[0.2em]">
                        Zero Friction
                    </div>

                    <div className="step-3 pointer-events-none absolute flex w-full flex-col items-center">
                        <span className="font-mono text-xl font-bold uppercase tracking-[0.2em] sm:text-3xl md:text-5xl md:tracking-[0.3em]">
                            Focus on the blade
                        </span>
                        <div className="mt-4 h-[2px] w-12 bg-primary shadow-[0_0_10px_hsl(var(--primary))] md:mt-6 md:w-24" />
                    </div>
                </div>
            </div>

            {/* UI Metadata - Nascosta su schermi molto piccoli per pulizia */}
            <div className="absolute bottom-6 left-6 hidden flex-col gap-1 font-mono text-[8px] uppercase tracking-widest opacity-40 sm:flex md:bottom-10 md:left-10 md:text-[10px]">
                <span className="flex items-center gap-2">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-primary" />
                    Phase: Kinetic_Evolution
                </span>
                <span>System: v2.0.26</span>
            </div>
        </section>
    );
}
