import { cn } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/button';

// Icons
import { Loader2, Save } from 'lucide-react';

// Interfaces
interface Props {
    processing: boolean;
    isDirty: boolean;
    reset: () => void;
}

export function SubmitSalon({ processing, isDirty, reset }: Props) {
    return (
        <div className="mt-10 flex flex-col gap-0 space-y-2  bg-muted/5 p-1 sm:flex-row sm:items-center">
            <Button
                type="submit"
                disabled={processing}
                className={cn(
                    'relative h-12 flex-1 rounded-none shadow-none transition-all duration-300 sm:min-w-[200px] sm:flex-none',
                    'bg-primary text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground',
                    'border border-transparent hover:border-primary hover:bg-transparent hover:text-primary',
                    'disabled:opacity-50 disabled:grayscale',
                )}
            >
                {processing ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Syncing_Data...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Save className="h-3.5 w-3.5" />
                        <span>Commit_Changes</span>
                    </div>
                )}
            </Button>

            <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={processing || !isDirty}
                className={cn(
                    'h-12 flex-1 rounded-none text-[10px] font-bold uppercase tracking-[0.15em] sm:flex-none',
                    'transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground',
                    'opacity-60 disabled:opacity-20',
                )}
            >
                Rollback_Changes
            </Button>

            {/* Indicatore Stato - Piccolo dettaglio tecnico a destra */}
            <div className="hidden flex-1 justify-end px-4 sm:flex">
                <span className="font-mono text-[8px] uppercase tracking-tighter text-muted-foreground/40">
                    {isDirty ? '[Status: Pending_Changes]' : '[Status: Synced]'}
                </span>
            </div>
        </div>
    );
}
