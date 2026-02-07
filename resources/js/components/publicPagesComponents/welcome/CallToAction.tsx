import { Link, router } from '@inertiajs/react';
import { toast } from 'sonner';

// Components
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Icons
import { MessageCircleQuestionMark } from 'lucide-react';

// Interfaces
import type { User } from '@/interfaces/auth';

export function CallToAction({ user }: { user: User | null }) {
    return (
        <section className="mx-auto bg-foreground/20 px-6 md:px-0">
            <div className="group relative overflow-hidden px-10 py-24 text-primary-foreground transition-colors duration-500 dark:shadow-primary/10 md:px-24 md:py-32">
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
                                The professional's choice for modern management.
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
                                        {user
                                            ? 'This is just for saloons owners, if you proceed you will not be able to book appointments to other barbers'
                                            : 'This is just for saloons owners'}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href={user ? '#' : '/become-barber'}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                variant="secondary"
                                className="h-24 w-full rounded-none bg-primary-foreground text-xl font-black uppercase italic text-primary shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] sm:w-64"
                                onClick={() =>
                                    user &&
                                    router.post(
                                        route('become.barber.request'),
                                        {},
                                        {
                                            preserveScroll: true,
                                            onFinish: () => {
                                                toast.success('Request sent!', {
                                                    description: 'We will review your request soon.',
                                                });
                                            },
                                        },
                                    )
                                }
                            >
                                {user
                                    ? 'Manage your studio'
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
    );
}
