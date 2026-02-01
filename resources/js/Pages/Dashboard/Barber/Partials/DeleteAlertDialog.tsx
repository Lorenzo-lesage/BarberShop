// Components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Icons
import { AlertTriangle, Loader2 } from 'lucide-react';

// Interfaces
interface DeleteAlertDialogProps {
    target: { id: number; type: 'exception' | 'saloon' | 'photo' } | null;
    isDeleting: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export function DeleteAlertDialog({
    target,
    isDeleting,
    onConfirm,
    onClose,
}: DeleteAlertDialogProps) {
    /*
    |-------------------------------------------------------------------
    | Methods
    |-------------------------------------------------------------------
    */

    /**
     * Get content
     * @returns
     */
    const getContent = () => {
        switch (target?.type) {
            case 'exception':
                return {
                    title: 'TERMINATE_LOCK_SEQUENCE?',
                    desc: 'This will immediately reopen these dates for public bookings. System state will be restored.',
                    button: 'Confirm_Unlock',
                };
            case 'photo':
                return {
                    title: 'PURGE_VISUAL_ASSET?',
                    desc: 'This image will be permanently erased from the storage cluster. This action is irreversible.',
                    button: 'Confirm_Purge',
                };
            case 'saloon':
                return {
                    title: 'DECOMMISSION_ENTIRE_SALOON?',
                    desc: 'WARNING: This will wipe all salon data, schedules, and configurations from the core database.',
                    button: 'Final_Decommission',
                };
            default:
                return { title: '', desc: '', button: '' };
        }
    };

    const content = getContent();

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */
    return (
        <AlertDialog
            open={target !== null}
            onOpenChange={(open) => !open && onClose()}
        >
            <AlertDialogContent className="max-w-[90vw] rounded-none border-2 border-border bg-background p-8 sm:max-w-md">
                <AlertDialogHeader className="space-y-4">
                    <div className="flex items-center gap-3 text-destructive">
                        <AlertTriangle size={20} strokeWidth={3} />
                        <AlertDialogTitle className="text-xl font-black uppercase italic tracking-tighter">
                            {content.title}
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-[11px] font-bold uppercase leading-relaxed tracking-widest text-muted-foreground/70">
                        {content.desc}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-8 flex-col gap-3 sm:flex-row">
                    <AlertDialogCancel className="h-11 rounded-none border-border/60 text-[10px] font-black uppercase tracking-widest hover:bg-muted">
                        Abort_Mission
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isDeleting}
                        className="h-11 min-w-[140px] rounded-none bg-destructive text-[10px] font-black uppercase tracking-widest text-white hover:bg-destructive/90"
                    >
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            content.button
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
