'use client';

import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
import { CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    /*
    |------------------------------------------
    | Data
    |------------------------------------------
    */

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
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
    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    /*
    |------------------------------------------
    | Render
    |------------------------------------------
    */

    return (
        <section className={cn('space-y-12', className)}>
            {/* HEADER TECNICO */}
            <header className="relative border-l-2 border-primary pl-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                    Security_Protocol
                </h2>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                    Access Credentials
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Update system keys to ensure account integrity.
                </p>
            </header>

            <form onSubmit={updatePassword} className="max-w-xl space-y-10">
                <div className="space-y-8">
                    {/* Current Password */}
                    <div className="group relative space-y-2">
                        <Label
                            htmlFor="current_password"
                            className={cn(
                                'text-[9px] font-black uppercase tracking-[0.3em] transition-colors',
                                errors.current_password
                                    ? 'text-destructive'
                                    : 'text-muted-foreground',
                            )}
                        >
                            Verification_Key (Current)
                        </Label>
                        <div className="relative">
                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) =>
                                    setData('current_password', e.target.value)
                                }
                                type="password"
                                className="h-12 rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 text-sm font-bold tracking-[0.3em] focus-visible:border-primary focus-visible:ring-0"
                            />
                            <LockKeyhole
                                size={14}
                                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20"
                            />
                        </div>
                        {errors.current_password && (
                            <p className="text-[10px] font-bold uppercase italic text-destructive animate-in fade-in slide-in-from-left-2">
                                {errors.current_password}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="group relative space-y-2">
                        <Label
                            htmlFor="password"
                            className={cn(
                                'text-[9px] font-black uppercase tracking-[0.3em] transition-colors',
                                errors.password
                                    ? 'text-destructive'
                                    : 'text-muted-foreground',
                            )}
                        >
                            Generation_New_Key
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                type="password"
                                className="h-12 rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 text-sm font-bold tracking-[0.3em] focus-visible:border-primary focus-visible:ring-0"
                            />
                            <ShieldCheck
                                size={14}
                                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-[10px] font-bold uppercase italic text-destructive animate-in fade-in slide-in-from-left-2">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="group relative space-y-2">
                        <Label
                            htmlFor="password_confirmation"
                            className={cn(
                                'text-[9px] font-black uppercase tracking-[0.3em] transition-colors',
                                errors.password_confirmation
                                    ? 'text-destructive'
                                    : 'text-muted-foreground',
                            )}
                        >
                            Confirm_Identity_Key
                        </Label>
                        <Input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="h-12 rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 text-sm font-bold tracking-[0.3em] focus-visible:border-primary focus-visible:ring-0"
                        />
                        {errors.password_confirmation && (
                            <p className="text-[10px] font-bold uppercase italic text-destructive animate-in fade-in slide-in-from-left-2">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-6 pt-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-12 rounded-none px-10 text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        {processing ? 'Encrypting...' : 'Update Keys'}
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-500"
                        enterFrom="opacity-0 -translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition opacity duration-500"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 text-primary">
                            <CheckCircle2 size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                Protocol Secured
                            </span>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
