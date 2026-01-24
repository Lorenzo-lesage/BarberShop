'use client';

import { Link } from '@inertiajs/react'; // Importante per mantenere la velocità di Inertia
import React from 'react';

// Components
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Icons
import { Slash } from 'lucide-react';

// Interfaces
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';

export function BreadcrumbNav({ items }: { items: BreadcrumbItemType[] }) {
    if (items.length === 0) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList className="gap-0 sm:gap-0">
                {' '}
                {/* Rimuoviamo il gap standard per controllo totale */}
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const itemKey = item.href || item.label;

                    return (
                        <React.Fragment key={itemKey}>
                            <BreadcrumbItem>
                                {item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {/* Trasformiamo gli spazi in underscore per il look tecnico */}
                                        {item.label.replace(/\s+/g, '_')}
                                    </Link>
                                ) : (
                                    <BreadcrumbPage className="text-[10px] font-black uppercase italic tracking-[0.2em] text-foreground">
                                        {item.label.replace(/\s+/g, '_')}
                                    </BreadcrumbPage>
                                )}
                            </BreadcrumbItem>

                            {!isLast && (
                                <BreadcrumbSeparator className="px-2 text-muted-foreground/30">
                                    {/* Usiamo uno Slash o un Chevron molto sottile */}
                                    <Slash
                                        size={10}
                                        strokeWidth={3}
                                        className="-rotate-12"
                                    />
                                </BreadcrumbSeparator>
                            )}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
