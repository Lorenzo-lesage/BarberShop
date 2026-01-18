import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SearchBarProps {
    filters: { search?: string };
    routeName: string;
}

export default function SearchBar({ filters, routeName }: SearchBarProps) {
    const [search, setSearch] = useState(filters.search || '');

    // Creiamo la funzione di ricerca ritardata (400ms)
    // useMemo è fondamentale: mantiene la stessa istanza della funzione tra i render
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
                    },
                );
            }, 400),
        [routeName],
    );

    // Pulizia: se il componente viene smontato, cancelliamo ricerche pendenti
    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value); // L'input rimane reattivo e fluido
        debouncedSearch(value); // La chiamata al server parte solo dopo che l'utente smette di scrivere
    };

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search for city, province, region..."
                className="pl-10"
                value={search}
                onChange={handleChange}
                type="search"
            />
        </div>
    );
}
