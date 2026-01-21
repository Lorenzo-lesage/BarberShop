'use client';

import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';

// Components
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

// Interfaces
import { LaravelPaginationLink } from '@/interfaces/pagination';

// Icons (Opzionali se vuoi cambiare le frecce standard)

interface Props {
    links: LaravelPaginationLink[];
}

export function MyPagination({ links }: Props) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    if (links.length <= 3) return null; // Nascondi se c'è solo una pagina

    const previousLink = links[0];
    const nextLink = links[links.length - 1];
    const centralLinks = links.slice(1, -1);

    /*
    |--------------------------------------------------------------------------
    | Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Handle navigation
     * @param url
     * @param active
     */
    const handleNavigation = (url: string | null, active: boolean) => {
        if (url && !active) {
            router.get(
                url,
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <Pagination className="mt-12 border-t border-border pt-8">
            <PaginationContent className="gap-0 border border-border bg-background shadow-sm">
                {/* PREVIOUS */}
                <PaginationItem className="border-r border-border">
                    <PaginationPrevious
                        href={previousLink.url || '#'}
                        className={cn(
                            'h-12 rounded-none px-6 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-muted',
                            !previousLink.url &&
                                'pointer-events-none opacity-20',
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(previousLink.url, false);
                        }}
                    />
                </PaginationItem>

                {/* NUMBERS */}
                <div className="hidden items-center sm:flex">
                    {centralLinks.map((link, idx) => {
                        if (link.label === '...') {
                            return (
                                <PaginationItem
                                    key={idx}
                                    className="border-r border-border px-4 text-muted-foreground/40"
                                >
                                    <PaginationEllipsis className="h-4 w-4" />
                                </PaginationItem>
                            );
                        }

                        return (
                            <PaginationItem
                                key={idx}
                                className="border-r border-border last:border-r-0"
                            >
                                <PaginationLink
                                    href={link.url || '#'}
                                    isActive={link.active}
                                    className={cn(
                                        'h-12 w-12 rounded-none border-none text-[10px] font-black transition-all',
                                        link.active
                                            ? 'pointer-events-none bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigation(link.url, link.active);
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </PaginationItem>
                        );
                    })}
                </div>

                {/* MOBILE INDICATOR (Mostra solo pagina attuale su mobile) */}
                <div className="flex h-12 items-center border-r border-border px-4 text-[10px] font-black sm:hidden">
                    PAGE_{centralLinks.find((l) => l.active)?.label || '1'}
                </div>

                {/* NEXT */}
                <PaginationItem>
                    <PaginationNext
                        href={nextLink.url || '#'}
                        className={cn(
                            'h-12 rounded-none px-6 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-muted',
                            !nextLink.url && 'pointer-events-none opacity-20',
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(nextLink.url, false);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
