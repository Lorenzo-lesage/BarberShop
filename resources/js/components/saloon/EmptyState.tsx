import { Link, usePage } from '@inertiajs/react';

// Components
import { Button } from '@/components/ui/button';

// Icons
import { Plus, SearchX } from 'lucide-react';

// Interfaces

export function EmptyState({
    title = 'No Results Found',
    message = 'The registry does not contain any saloons',
    hasSearch = false,
}: {
    title?: string;
    message?: string;
    filters?: { search?: string };
    hasSearch?: boolean;
}) {
    /*
    |-----------------------------------------------------------------------
    | Data
    |-----------------------------------------------------------------------
    */

    const { auth } = usePage().props;
    const canCreateStudio = !!auth.user?.is_barber && !hasSearch;

    /*
    |-----------------------------------------------------------------------
    | Render
    |-----------------------------------------------------------------------
    */

    return (
        <div className="relative flex min-h-[400px] w-full flex-col items-center justify-center border border-dashed border-border bg-muted/5 px-6 py-20 text-center">
            {/* Decorazione Angolare */}
            <div className="absolute left-4 top-4 font-mono text-[10px] text-muted-foreground/20">
                REF_ERR: 404_NULL
            </div>

            {/* Icona Mirroring */}
            <div className="relative mb-8">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/10 opacity-20" />
                <div className="relative flex h-20 w-20 items-center justify-center border border-border bg-background">
                    <SearchX
                        size={32}
                        strokeWidth={1}
                        className="text-muted-foreground/40"
                    />
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-sm space-y-4">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">
                    {title}
                </h3>
                <p className="text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-muted-foreground/60">
                    {message}
                </p>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {canCreateStudio && (
                    <Link href={route('dashboard.barber.saloon')}>
                        <Button className="h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Plus className="mr-2 h-3 w-3" />
                            Register Studio
                        </Button>
                    </Link>
                )}
            </div>

            {/* Footer dell'Empty State */}
            <div className="absolute bottom-4 flex w-full justify-center">
                <div className="h-[1px] w-12 bg-border" />
            </div>
        </div>
    );
}
