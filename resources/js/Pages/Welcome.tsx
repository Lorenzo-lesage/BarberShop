import hero from '@/assets/hero.jpg';

// Layout Components

// Partials
import { CallToAction } from '@/components/publicPagesComponents/welcome/CallToAction';
import { DashboardPreview } from '@/components/publicPagesComponents/welcome/DashboardPreview';
import { DualExperience } from '@/components/publicPagesComponents/welcome/DualExperience';
import { EvolutionSection } from '@/components/publicPagesComponents/welcome/EvolutionSection';
import { FeaturedSaloons } from '@/components/publicPagesComponents/welcome/FeaturedSaloons';
import { FeautersBento } from '@/components/publicPagesComponents/welcome/FeaturesBento';
import { HeroSection } from '@/components/publicPagesComponents/welcome/HeroSection';

// Components

// Layout
import AppShell from '@/Layouts/Appshell';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

// Icons

// Interfaces
import type { User } from '@/interfaces/auth';
import type { Saloon } from '@/interfaces/saloon';

export default function Welcome({
    saloons,
}: PageProps<{
    laravelVersion: string;
    phpVersion: string;
    saloons: Saloon[];
}>) {
    const { auth } = usePage().props;

    return (
        <AppShell>
            <Head title="BarberShop | The Artisan Standard" />

            <div className="w-full overflow-hidden selection:bg-primary selection:text-primary-foreground">
                {/* --- TUO SFONDO ORIGINALE (INTEGRATO CON LAYER DI PROFONDITÀ) --- */}
                <div
                    style={{
                        backgroundImage: `linear-gradient(180deg, hsl(var(--background) / 0) 0%, hsl(var(--background)) 100%), url(${hero})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        zIndex: -1,
                        opacity: 0.8,
                    }}
                />

                <div className="z-10 mt-14 md:mt-32">
                    {/* --- HERO: THE STATEMENT --- */}
                    <HeroSection user={auth.user as User} />
                    {/* --- EVOLUTION: THE EVOLUTION --- */}
                    <EvolutionSection />
                    {/* --- FEATURED SECTION: THE ELITE NETWORK --- */}
                    <FeaturedSaloons saloons={saloons} />
                    {/* --- FEATURES: BENTO LOGIC 2.0 --- */}
                    <FeautersBento />
                    {/* --- CTA: THE CONVERSION --- */}
                    {!auth?.user?.is_barber && (
                        <CallToAction user={auth.user as User} />
                    )}
                    {/* --- THE DUAL EXPERIENCE: BARBER & CLIENT --- */}
                    <DualExperience />
                    {/* --- DASHBOARD PREVIEW: THE COMMAND CENTER --- */}
                    <DashboardPreview />
                </div>
            </div>
        </AppShell>
    );
}
