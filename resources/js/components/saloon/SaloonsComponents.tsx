import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Interfaces
import type { Saloon } from '@/interfaces/saloon';

// Components
import { EmptyState } from '@/components/saloon/EmptyState';
import { SaloonCard } from '@/components/saloon/SaloonCard';
import { SaloonSkeleton } from '@/components/saloon/SaloonSkeleton';

interface Props {
    saloons: Saloon[];
    routeName?: string;
    filters?: { search?: string };
    isLoading: boolean;
}

export default function SaloonsComponent({
    saloons,
    routeName = 'saloons.show',
    filters,
    isLoading = false,
}: Props) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const { auth } = usePage().props;
    const authId = auth.user?.id;

    // Filtered Saloons
    const safeSaloons = saloons ?? [];
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get('search');
    const hasSearch = Boolean(
        (filters?.search && filters.search.trim().length > 0) ||
        (searchFromUrl && searchFromUrl.trim().length > 0),
    );
    const isEmpty = safeSaloons.length === 0;

    // Skeleton
    const [showSkeleton, setShowSkeleton] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Hooks
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isLoading) {
            timer = setTimeout(() => {
                setShowSkeleton(true);
            }, 500);
        } else {
            setShowSkeleton(false);
        }

        return () => clearTimeout(timer);
    }, [isLoading]);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    if (showSkeleton) {
        return (
            <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <SaloonSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (isEmpty) {
        return (
            <EmptyState
                title={hasSearch ? 'No results found' : 'No studios yet'}
                message={
                    hasSearch
                        ? 'Try adjusting your search.'
                        : 'Start by creating your first studio.'
                }
                hasSearch={hasSearch}
            />
        );
    }

    return (
        <div className="grid grid-cols-2 gap-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saloons.map((saloon) => (
                <SaloonCard
                    key={saloon.id}
                    saloon={saloon}
                    isOwner={authId === saloon.user_id}
                    routeName={routeName}
                />
            ))}
        </div>
    );
}
