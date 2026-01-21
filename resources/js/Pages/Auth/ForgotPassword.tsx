'use client';

import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Layout & Icons
import AppShell from '@/Layouts/Appshell';
import { ArrowLeft, Mail, ShieldAlert } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    /*
    |--------------------------------------------------------------------------
    | Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Handles the form submission.
     * @param e
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */
    return (
        <AppShell>
            <Head title="Recovery Protocol" />

            <div className="mx-auto mt-14 flex w-full max-w-[450px] flex-col gap-12 py-24 md:mt-32">
                {/* --- HEADER TECNICO --- */}
                <header className="relative space-y-2 border-l-4 border-primary pl-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">
                        Security_Recovery
                    </div>
                    <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter">
                        Key_Reset
                    </h1>
                    <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest text-muted-foreground/50">
                        Initiate credentials restoration protocol via encrypted
                        email link.
                    </p>
                </header>

                {/* --- STATUS MESSAGE --- */}
                {status && (
                    <div className="flex items-center gap-3 border border-primary/20 bg-primary/5 p-4 animate-in fade-in slide-in-from-top-2">
                        <ShieldAlert size={16} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                            {status}
                        </span>
                    </div>
                )}

                <div className="space-y-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="group space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary"
                            >
                                Registered_System_Email
                            </Label>
                            <div className="relative flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="IDENTIFIER@DOMAIN.COM"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="h-12 rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 text-sm font-bold uppercase tracking-widest placeholder:text-muted-foreground/20 focus-visible:border-primary focus-visible:ring-0"
                                        autoFocus
                                        required
                                    />
                                    <Mail
                                        size={14}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-12 rounded-none bg-primary px-6 text-[10px] font-black uppercase tracking-[0.2em]"
                                >
                                    {processing ? 'SENDING...' : 'Reset_Key'}
                                </Button>
                            </div>
                            {errors.email && (
                                <p className="text-[10px] font-bold uppercase italic text-destructive animate-in fade-in">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </form>

                    {/* --- BACK TO LOGIN --- */}
                    <footer className="border-t border-border/50 pt-4">
                        <a
                            href={route('login')}
                            className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                        >
                            <ArrowLeft
                                size={12}
                                className="transition-transform group-hover:-translate-x-1"
                            />
                            Back_to_Access_Portal
                        </a>
                    </footer>
                </div>
            </div>
        </AppShell>
    );
}
