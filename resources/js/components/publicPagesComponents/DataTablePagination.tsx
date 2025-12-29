import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { router } from '@inertiajs/react';

interface Props {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export function MyPagination({ links }: Props) {
    // Troviamo l'indice del link attivo e i link prec/succ
    const previousLink = links[0];
    const nextLink = links[links.length - 1];

    // I link centrali (escludendo il primo e l'ultimo che sono "Prec" e "Succ")
    const centralLinks = links.slice(1, -1);

    return (
        <Pagination>
            <PaginationContent>
                {/* Bottone Precedente */}
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
                    // Gestione Ellipsis (se Laravel invia "...")
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
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (link.url)
                                        router.get(
                                            link.url,
                                            {},
                                            { preserveScroll: true },
                                        );
                                }}
                            >
                                {link.label}
                            </PaginationLink>
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
