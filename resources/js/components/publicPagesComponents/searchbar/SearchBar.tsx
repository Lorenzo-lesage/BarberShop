import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SearchBarProps {
    filters: { search?: string };
    routeName: string;
}

export default function SearchBar({ filters, routeName }: SearchBarProps) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Methods
    |--------------------------------------------------------------------------
    */

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                router.get(
                    route(routeName),
                    { search: value },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                        onBefore: () => setIsLoading(true),
                        onFinish: () => setIsLoading(false),
                    },
                );
            }, 400),
        [routeName],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    /*
    |--------------------------------------------------------------------------
    | Hooks
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="group relative w-full max-w-md">
            {/* Label Tecnica Superiore */}
            <div className="mb-2 flex items-center justify-between px-1">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                    {isLoading ? 'Scanning Registry...' : 'Search Registry'}
                </label>
                {isLoading && (
                    <div className="h-1 w-12 animate-pulse bg-primary" />
                )}
                <span className="font-mono text-[9px] italic text-muted-foreground/30">
                    {search.length > 0
                        ? `Filtering: ${search.length}ch`
                        : 'Waiting for input...'}
                </span>
            </div>

            <div className="relative">
                {/* Icona Mirino (Invece della lente classica) */}
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <Search
                        size={14}
                        className={cn(
                            'transition-all duration-300',
                            search.length > 0
                                ? 'rotate-90 scale-110 text-primary'
                                : 'text-muted-foreground/40',
                        )}
                    />
                </div>

                <Input
                    placeholder="CITY, PROVINCE, REGION..."
                    className={cn(
                        'h-12 w-full rounded-none border-border bg-background pl-12 pr-4 text-xs font-bold uppercase tracking-widest transition-all',
                        'placeholder:text-[10px] placeholder:font-medium placeholder:tracking-[0.2em] placeholder:text-muted-foreground/30',
                        'focus-visible:border-primary focus-visible:bg-primary/5 focus-visible:ring-0',
                        search.length > 0 && 'border-primary/50',
                    )}
                    value={search}
                    onChange={handleChange}
                    type="search"
                />

                {/* Decorazione Angolare (Stile Mirino) */}
                <div className="absolute -bottom-[1px] -right-[1px] h-2 w-2 border-b border-r border-primary/40 opacity-0 transition-opacity group-focus-within:opacity-100" />
                <div className="absolute -left-[1px] -top-[1px] h-2 w-2 border-l border-t border-primary/40 opacity-0 transition-opacity group-focus-within:opacity-100" />
            </div>
        </div>
    );
}
