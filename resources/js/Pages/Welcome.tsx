import bg2 from '@/assets/bg2.jpg';

// Layout Components
import { SaloonCarousel } from '@/components/publicPagesComponents/welcome/SaloonCarousel';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Layout
import AppShell from '@/Layouts/Appshell';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

// Icons
import {
    ArrowRight,
    ArrowUpRight,
    Calendar,
    LayoutDashboard,
    MessageCircleQuestionMark,
    Star,
    Users,
} from 'lucide-react';

// Interfaces
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
                        backgroundImage: `linear-gradient(180deg, hsl(var(--background) / 0) 0%, hsl(var(--background)) 100%), url(${bg2})`,
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
                    <header className="container mx-auto mb-10 flex h-[95vh] flex-col justify-center px-6 md:px-12">
                        <div className="max-w-5xl space-y-10">
                            <Badge
                                variant="outline"
                                className="inline-flex items-center border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.3em] text-white backdrop-blur-xl"
                            >
                                <Star className="mr-2 h-3 w-3 fill-primary text-primary" />
                                Engineered for Professionals • 2026
                            </Badge>

                            <div className="space-y-4">
                                <h1 className="text-7xl font-black uppercase leading-[0.85] tracking-tighter sm:text-8xl md:text-[11rem]">
                                    Barber <br />
                                    <span className="text-foreground/80 opacity-80">
                                        Shop
                                    </span>
                                </h1>
                            </div>

                            <p className="max-w-2xl text-xl font-light leading-relaxed text-muted-foreground/80 md:text-2xl">
                                Redefining the intersection of{' '}
                                <span className="font-medium italic text-foreground">
                                    tradition
                                </span>{' '}
                                and{' '}
                                <span className="font-medium italic text-foreground">
                                    technology
                                </span>
                                . A high-performance engine for your barbering
                                business.
                            </p>

                            {!auth.user && (
                                <div className="flex flex-col gap-6 pt-12 sm:flex-row">
                                    <Link href={route('login')}>
                                        <Button
                                            size="lg"
                                            className="group h-16 rounded-none bg-primary px-12 text-sm font-black uppercase tracking-widest transition-all hover:bg-white hover:text-black"
                                        >
                                            Get Started
                                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* --- FEATURED SECTION: THE ELITE NETWORK --- */}
                    <section className="relative overflow-hidden bg-background py-40 transition-colors duration-500">
                        {/* Background accent decorativo - un fascio di luce sottile */}
                        <div className="absolute left-1/2 top-0 h-[1px] w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

                        <div className="container mx-auto px-6 md:px-12">
                            <div className="relative mb-24 flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-[1px] w-12 bg-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
                                            Curated Selection
                                        </span>
                                    </div>

                                    <h2 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter sm:text-7xl md:text-8xl">
                                        The Elite <br />
                                        <span className="text-outline-adaptive italic opacity-20">
                                            Network.
                                        </span>
                                    </h2>
                                </div>

                                <div className="flex flex-col items-start gap-6 lg:items-end">
                                    <p className="max-w-[300px] text-sm font-light leading-relaxed text-muted-foreground lg:text-right">
                                        Only the most prestigious studios,
                                        vetted for technical excellence and
                                        atmosphere.
                                    </p>
                                    <Link
                                        href={route('saloons.index')}
                                        className="group flex items-center gap-4 border-b border-foreground/10 pb-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:border-primary"
                                    >
                                        Explore all Studios
                                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                                    </Link>
                                </div>
                            </div>

                            {/* Carousel Container: eliminiamo il box grigio pesante e usiamo un'ombra soffusa */}
                            <div className="relative">
                                <div className="absolute -inset-4 bg-muted/5 blur-3xl dark:bg-primary/[0.02]" />
                                <div className="relative z-10">
                                    <SaloonCarousel saloons={saloons} />
                                </div>
                            </div>
                        </div>

                        {/* Elemento decorativo verticale (stile editoriale) */}
                        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] lg:block">
                            <span className="text-[10px] font-medium uppercase tracking-[1em] text-muted-foreground/20">
                                Artisan Registry — 2026
                            </span>
                        </div>
                    </section>

                    {/* --- FEATURES: BENTO LOGIC 2.0 --- */}
                    <main className="container mx-auto px-6 pb-40 md:px-12">
                        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
                            {[
                                {
                                    icon: <Calendar className="h-8 w-8" />,
                                    title: 'Live Booking',
                                    desc: 'Zero-latency scheduling with automated conflict resolution.',
                                    tag: 'Engine',
                                },
                                {
                                    icon: <Users className="h-8 w-8" />,
                                    title: 'Client Intelligence',
                                    desc: 'Next-gen CRM to track every snip, preference, and visit history.',
                                    tag: 'CRM',
                                },
                                {
                                    icon: (
                                        <LayoutDashboard className="h-8 w-8" />
                                    ),
                                    title: 'Growth Analytics',
                                    desc: 'Data-driven insights to scale your brand and revenue.',
                                    tag: 'Data',
                                },
                            ].map((f, i) => (
                                <div
                                    key={i}
                                    className="group relative flex flex-col justify-between border border-white/[0.05] bg-[#0a0a0a]/40 p-12 transition-all duration-700 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="transition-transform duration-500 group-hover:scale-110">
                                                {f.icon}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                                {f.tag}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-black uppercase leading-none tracking-tighter md:text-2xl lg:text-3xl">
                                            {f.title}
                                        </h3>
                                        <p className="text-lg font-light leading-relaxed opacity-60 group-hover:opacity-100">
                                            {f.desc}
                                        </p>
                                    </div>
                                    <div className="mt-12 overflow-hidden">
                                        <div className="h-[2px] w-full translate-x-[-100%] bg-current transition-transform duration-700 group-hover:translate-x-0" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>

                    {/* --- CTA: THE CONVERSION --- */}
                    {!auth?.user?.is_barber && (
                        <section className="container mx-auto px-6 pb-40 md:px-12">
                            <div className="group relative overflow-hidden bg-primary px-10 py-24 text-primary-foreground shadow-2xl transition-colors duration-500 dark:shadow-primary/10 md:px-24 md:py-32">
                                {/* Texture a grana: invertiamo l'opacità in base al tema per renderla visibile ma elegante */}
                                <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay dark:opacity-[0.03]" />

                                <div className="relative z-10 flex flex-col items-center justify-between gap-16 lg:flex-row">
                                    <div className="max-w-3xl space-y-8 text-center lg:text-left">
                                        <h2 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter md:text-8xl">
                                            Elevate <br />
                                            Your Service.
                                        </h2>
                                        <div className="flex items-center justify-center gap-4 lg:justify-start">
                                            <p className="text-xl font-light italic tracking-wide opacity-90">
                                                The professional's choice for
                                                modern management.
                                            </p>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className="rounded-full border border-primary-foreground/20 p-1 transition-colors hover:bg-primary-foreground/10">
                                                        <MessageCircleQuestionMark
                                                            size={18}
                                                            className="opacity-70"
                                                        />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="right"
                                                    className="border-border bg-popover text-popover-foreground shadow-xl"
                                                >
                                                    <p className="p-1 text-[10px] font-bold uppercase tracking-widest">
                                                        Pro Suite Access
                                                        Included
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-6">
                                        <Link
                                            href={
                                                auth?.user
                                                    ? '#'
                                                    : '/become-barber'
                                            }
                                            className="w-full sm:w-auto"
                                        >
                                            <Button
                                                variant="secondary"
                                                className="h-24 w-full rounded-none bg-primary-foreground text-xl font-black uppercase italic text-primary shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] sm:w-64"
                                                onClick={() =>
                                                    auth?.user &&
                                                    router.post(
                                                        route(
                                                            'become.barber.request',
                                                        ),
                                                    )
                                                }
                                            >
                                                {auth?.user
                                                    ? 'Switch to Pro'
                                                    : 'Join the Network'}
                                            </Button>
                                        </Link>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-70">
                                            Verified Partners Only
                                        </span>
                                    </div>
                                </div>

                                {/* Elementi decorativi di sfondo che reagiscono al tema */}
                                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-opacity group-hover:opacity-20" />
                                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl transition-opacity group-hover:opacity-20" />
                            </div>
                        </section>
                    )}

                    {/* --- THE DUAL EXPERIENCE: BARBER & CLIENT --- */}
                    <section className="relative border-y border-border bg-background transition-colors duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* LEFT SIDE: FOR THE ARTISAN */}
                            <div className="group relative overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
                                <div className="relative z-10 space-y-12 p-12 md:p-24">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                                            For the Professional
                                        </span>
                                        <h3 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter text-foreground md:text-7xl">
                                            Scale your <br />
                                            <span className="text-outline-adaptive italic opacity-40 transition-opacity group-hover:opacity-100">
                                                Legacy.
                                            </span>
                                        </h3>
                                    </div>

                                    <p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground">
                                        Stop managing your business through
                                        fragmented chats and scattered notes.
                                        Reclaim your time with a
                                        high-performance engine designed for
                                        masters of the craft.
                                    </p>

                                    <ul className="space-y-6">
                                        {[
                                            'Real-time revenue & growth analytics',
                                            'Advanced CRM with technical style notes',
                                            'Priority placement in the elite network',
                                        ].map((text, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground/70 transition-colors group-hover:text-foreground"
                                            >
                                                <div className="h-[1px] w-8 bg-primary" />{' '}
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Background Accent - Più discreto in light mode */}
                                <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/4 translate-y-1/4 rounded-full bg-primary/[0.08] blur-[120px] transition-colors duration-700 group-hover:bg-primary/[0.12] dark:bg-primary/5" />
                            </div>

                            {/* RIGHT SIDE: FOR THE CLIENT */}
                            <div className="group relative overflow-hidden bg-muted/20 dark:bg-white/[0.02]">
                                <div className="relative z-10 space-y-12 p-12 md:p-24">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                                            For the Individual
                                        </span>
                                        <h3 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter text-foreground md:text-7xl">
                                            Refine your <br />
                                            <span className="text-outline-adaptive italic opacity-40 transition-opacity group-hover:opacity-100">
                                                Ritual.
                                            </span>
                                        </h3>
                                    </div>

                                    <p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground">
                                        Connect with the finest artisans in your
                                        city. Experience frictionless booking
                                        and bespoke service tailored to your
                                        personal aesthetic.
                                    </p>

                                    <ul className="space-y-6">
                                        {[
                                            'Access to top-tier verified barbers',
                                            'Instant 24/7 autonomous booking',
                                            'Personal style archive & preferences',
                                        ].map((text, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground/70 transition-colors group-hover:text-foreground"
                                            >
                                                <div className="h-[1px] w-8 bg-foreground/20 transition-colors group-hover:bg-foreground/60" />{' '}
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Background Accent */}
                                <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/4 -translate-y-1/4 rounded-full bg-foreground/[0.03] blur-[120px] dark:bg-white/5" />
                            </div>
                        </div>
                    </section>

                    {/* --- DASHBOARD PREVIEW: THE COMMAND CENTER --- */}
                    <section className="container mx-auto px-6 py-40 md:px-12">
                        <div className="flex flex-col gap-20 lg:flex-row lg:items-center">
                            <div className="order-2 space-y-8 lg:order-1 lg:w-1/2">
                                <Badge
                                    variant="outline"
                                    className="border-primary/20 bg-primary/5 text-primary"
                                >
                                    Control Tower
                                </Badge>
                                <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">
                                    One Terminal. <br />
                                    <span className="text-muted-foreground/30 dark:text-muted-foreground/40">
                                        Total Control.
                                    </span>
                                </h2>
                                <p className="max-w-md text-xl font-light leading-relaxed text-muted-foreground">
                                    Your shop's vitals, distilled into a single,
                                    high-performance interface. Monitor revenue,
                                    manage staff, and analyze growth without
                                    leaving the cockpit.
                                </p>
                                <div className="flex gap-12 pt-8">
                                    {[
                                        { v: '0.2s', l: 'Latency' },
                                        { v: '256-bit', l: 'Encryption' },
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <div className="text-3xl font-black tracking-tighter text-foreground">
                                                {stat.v}
                                            </div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-60">
                                                {stat.l}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* MOCKUP INTERATTIVO ADATTIVO */}
                            <div className="order-1 lg:order-2 lg:w-1/2">
                                <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-border bg-card p-3 shadow-2xl transition-colors">
                                    {/* Inner Terminal Shell */}
                                    <div className="flex h-full w-full flex-col border border-border/50 bg-background shadow-inner">
                                        {/* Fake Header */}
                                        <div className="flex h-12 items-center justify-between border-b border-border bg-muted/30 px-4">
                                            <div className="flex gap-1.5">
                                                <div className="h-2 w-2 rounded-full bg-red-500/30" />
                                                <div className="h-2 w-2 rounded-full bg-yellow-500/30" />
                                                <div className="h-2 w-2 rounded-full bg-green-500/30" />
                                            </div>
                                            <div className="h-4 w-32 rounded-full bg-muted" />
                                        </div>

                                        {/* Dashboard Content Mockup */}
                                        <div className="grid grid-cols-3 gap-4 p-6">
                                            {/* Stat Cards */}
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className="h-20 space-y-2 border border-border bg-muted/20 p-3"
                                                >
                                                    <div className="h-1 w-8 bg-primary/40" />
                                                    <div className="h-4 w-12 bg-muted" />
                                                </div>
                                            ))}

                                            {/* Main Chart Area */}
                                            <div className="relative col-span-3 h-40 overflow-hidden border border-border bg-gradient-to-t from-primary/5 to-transparent">
                                                <div className="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-10">
                                                    <svg
                                                        viewBox="0 0 400 100"
                                                        className="w-full fill-none stroke-primary stroke-[1.5]"
                                                    >
                                                        <path d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* List items simulated */}
                                            <div className="col-span-2 space-y-3">
                                                <div className="h-4 w-full bg-muted/40" />
                                                <div className="h-4 w-[90%] bg-muted/30" />
                                                <div className="h-4 w-2/3 bg-muted/20" />
                                            </div>
                                            <div className="h-20 border border-border bg-muted/10" />
                                        </div>
                                    </div>

                                    {/* Floating Badge (sempre scuro per contrasto o adattivo) */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-2xl transition-transform group-hover:scale-110">
                                        Real-time Sync Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppShell>
    );
}
