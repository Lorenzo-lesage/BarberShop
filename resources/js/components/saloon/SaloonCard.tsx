import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

// Interfaces
import type { Saloon } from '@/interfaces/saloon';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Icons
import { ArrowRight, MapPin } from 'lucide-react';

interface SaloonCardProps {
    saloon: Saloon;
    isOwner: boolean;
    routeName?: string;
    className?: string;
}

export function SaloonCard({
    saloon,
    isOwner,
    routeName = 'saloons.show',
    className,
}: SaloonCardProps) {
    return (
        <div
            className={cn(
                'group relative aspect-[3/4] overflow-hidden border-none',
                className,
            )}
        >
            {/* --- VISUAL LAYER --- */}
            <div
                className="absolute inset-0 z-0 h-[101%] transition-transform duration-1000 ease-out group-hover:scale-110"
                style={{
                    backgroundImage: saloon.main_photo
                        ? `linear-gradient(180deg, hsl(var(--background) / 0) 0%, hsl(var(--background)) 100%), url('/storage/${saloon.main_photo.path}?v=${saloon.updated_at}')`
                        : `linear-gradient(180deg, hsl(var(--background) / 0) 0%, hsl(var(--background)) 100%), url('/android-chrome-512x512.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    fill: saloon.main_photo
                        ? `linear-gradient(180deg, hsl(var(--background) / 0) 0%, hsl(var(--background)) 100%)`
                        : `currentColor`,
                    filter: saloon.main_photo ? 'none' : 'brightness(3)',
                }}
            />

            {/* --- Cinematic Overlay --- */}

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-20 flex h-full flex-col justify-between p-6">
                {/* Header: Status Badge */}
                <div className="flex items-start justify-between">
                    <Badge
                        className={cn(
                            'md:traking-[0.2em] rounded-none border-none bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] shadow-2xl',
                            isOwner
                                ? 'bg-white text-black shadow-[0_0_10px_rgba(var(--primary),0.8)]'
                                : 'bg-white/10 text-white backdrop-blur-xl',
                        )}
                    >
                        {isOwner ? 'Your Studio' : 'Verified'}
                    </Badge>

                    {/* Active Indicator Dot */}
                    <div
                        className={cn(
                            'h-1.5 w-1.5 rounded-full bg-white/40 transition-all duration-500 group-hover:bg-primary group-hover:shadow-[0_0_8px_#fff]',
                            isOwner
                                ? 'bg-primary/40 group-hover:shadow-[0_0_10px_rgba(var(--primary),0.8)]'
                                : 'bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_#fff]',
                        )}
                    />
                </div>

                {/* Footer: Info & Action */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="space-y-0">
                            <h3 className="font-black uppercase italic leading-none tracking-tighter text-primary transition-transform duration-500 group-hover:-translate-y-1 lg:text-3xl">
                                {saloon.name}
                            </h3>
                            <div className="flex items-center gap-2 pt-1 text-[8px] font-bold uppercase tracking-tighter lg:text-[11px]">
                                <MapPin size={10} className="text-primary" />
                                <span className="line-clamp-1 text-primary/50">
                                    {saloon.city} — {saloon.province}
                                </span>
                            </div>
                        </div>

                        {/* Artisan Divider */}
                        <div className="h-[1px] w-8 bg-primary/80 transition-all duration-700 ease-in-out group-hover:w-full group-hover:bg-primary" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="line-clamp-1 text-[8px] font-medium uppercase tracking-widest text-primary lg:text-[10px]">
                            Directed by{' '}
                            <span className="font-black italic text-primary/50">
                                {saloon.barber?.name}
                            </span>
                        </p>

                        <Link
                            href={route(routeName, saloon.id)}
                            prefetch
                            className="opacity-100 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 lg:translate-y-4 lg:opacity-0"
                        >
                            <Button
                                variant="outline"
                                className="group h-11 w-full rounded-none border-primary/20 bg-primary/5 px-4 text-[9px] font-black uppercase tracking-[0.08em] text-primary backdrop-blur-md transition-all hover:border-white hover:bg-white hover:text-black md:h-12 md:px-6 md:text-xs lg:tracking-[0.3em]"
                            >
                                {isOwner ? 'Manage Registry' : 'Secure Session'}
                                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 lg:ml-2 lg:h-4 lg:w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
