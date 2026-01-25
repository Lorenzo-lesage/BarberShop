import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function SaloonHeader({
    saloonId,
    onDelete,
}: {
    saloonId?: number;
    onDelete: () => void;
}) {
    return (
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 p-8 md:flex-row md:items-center">
            <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                    Saloon_Config
                </h1>
                <div className="mt-1 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                        System_Active_v2.0
                    </span>
                </div>
            </div>

            {saloonId && (
                <Button
                    variant="ghost"
                    onClick={onDelete}
                    className="rounded-none border border-destructive/20 text-[9px] font-black uppercase tracking-widest text-destructive hover:bg-destructive hover:text-white"
                >
                    <Trash2 className="mr-2 h-3 w-3" /> Decommission_Saloon
                </Button>
            )}
        </div>
    );
}
