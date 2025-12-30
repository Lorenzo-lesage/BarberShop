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

interface Props {
    links: LaravelPaginationLink[];
}
export function MyPagination({ links }: Props) {
    const previousLink = links[0];
    const nextLink = links[links.length - 1];
    const centralLinks = links.slice(1, -1);

    return (
        <Pagination>
            <PaginationContent>
                {/* Bottone Precedente (Già gestito col pointer-events-none) */}
                <PaginationItem>
                    <PaginationPrevious
                        href={previousLink.url || '#'}
                        className={
                            !previousLink.url
                                ? 'pointer-events-none opacity-50'
                                : ''
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            if (previousLink.url)
                                router.get(
                                    previousLink.url,
                                    {},
                                    { preserveScroll: true },
                                );
                        }}
                    />
                </PaginationItem>

                {/* Numeri di pagina */}
                {centralLinks.map((link, idx) => {
                    if (link.label === '...') {
                        return (
                            <PaginationItem key={idx}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={idx}>
                            <PaginationLink
                                href={link.url || '#'}
                                isActive={link.active}
                                // AGGIUNGIAMO QUESTE CLASSI
                                className={
                                    link.active
                                        ? 'pointer-events-none cursor-default'
                                        : 'cursor-pointer'
                                }
                                onClick={(e) => {
                                    e.preventDefault();
                                    // AGGIUNGIAMO IL CONTROLLO !link.active
                                    if (link.url && !link.active) {
                                        router.get(
                                            link.url,
                                            {},
                                            { preserveScroll: true },
                                        );
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </PaginationItem>
                    );
                })}

                {/* Bottone Successivo */}
                <PaginationItem>
                    <PaginationNext
                        href={nextLink.url || '#'}
                        className={
                            !nextLink.url
                                ? 'pointer-events-none opacity-50'
                                : ''
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            if (nextLink.url)
                                router.get(
                                    nextLink.url,
                                    {},
                                    { preserveScroll: true },
                                );
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
