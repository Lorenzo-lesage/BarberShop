'use client';

import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteUserForm({
    className = '',
    isOAuth = false,
}: {
    className?: string;
    isOAuth?: boolean;
}) {
    /*
    |------------------------------------------
    | Data
    |------------------------------------------
    */

    const [open, setOpen] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    /*
    |------------------------------------------
    | Methods
    |------------------------------------------
    */

    /**
     * Handles the form submission.
     * @param e
     */
    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    /**
     * Closes the modal.
     */
    const closeModal = () => {
        setOpen(false);
        clearErrors();
        reset();
    };

    /*
    |------------------------------------------
    | Render
    |------------------------------------------
    */

    return (
        <section
            className={cn(
                'space-y-12 border-t border-destructive/20 pt-12',
                className,
            )}
        >
            {/* HEADER TECNICO DI PERICOLO */}
            <header className="relative border-l-2 border-destructive pl-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-destructive">
                    Terminal_Action
                </h2>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                    Delete Registry
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Irreversible removal of all personal resources and system
                    data.
                </p>
            </header>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-12 rounded-none border-destructive/50 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-destructive hover:bg-destructive hover:text-white"
                    >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Terminate Account
                    </Button>
                </DialogTrigger>

                <DialogContent className="rounded-none border-destructive/50 bg-background sm:max-w-[480px]">
                    <form onSubmit={deleteUser}>
                        <DialogHeader className="space-y-4">
                            <div className="flex h-12 w-12 items-center justify-center border border-destructive/30 bg-destructive/5 text-destructive">
                                <AlertTriangle size={24} />
                            </div>
                            <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">
                                Confirm System Deletion
                            </DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase leading-relaxed tracking-widest text-muted-foreground">
                                You are about to wipe all data from our servers.
                                This process is{' '}
                                <span className="text-destructive underline">
                                    permanent
                                </span>
                                .
                                {!isOAuth &&
                                    ' Please authorize with your secret key.'}
                            </DialogDescription>
                        </DialogHeader>

                        {!isOAuth && (
                            <div className="mt-8 space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground"
                                >
                                    Authorization_Key
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="ENTER PASSWORD"
                                    className={cn(
                                        'h-12 rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 text-sm font-bold tracking-[0.3em] focus-visible:border-destructive focus-visible:ring-0',
                                        errors.password && 'border-destructive',
                                    )}
                                    autoFocus
                                />

                                {errors.password && (
                                    <p className="text-[9px] font-bold uppercase italic text-destructive animate-in fade-in slide-in-from-top-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        )}

                        <DialogFooter className="mt-10 gap-4 sm:flex-row-reverse sm:justify-start">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-12 rounded-none bg-destructive px-8 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-destructive/90"
                            >
                                {processing
                                    ? 'Wiping...'
                                    : 'Confirm Termination'}
                            </Button>

                            <Button
                                type="button"
                                onClick={closeModal}
                                className="h-12 rounded-none border-border bg-transparent px-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground hover:bg-muted"
                            >
                                Abort
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
