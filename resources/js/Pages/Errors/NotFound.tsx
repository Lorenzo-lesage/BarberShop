'use client';

import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, SearchX, Terminal } from 'lucide-react';

// Layout
import AppShell from '@/Layouts/Appshell';

// UI Components
import { Button } from '@/components/ui/button';

export default function NotFound() {
    /*
    |-------------------------------------------------------------------
    | Data
    |-------------------------------------------------------------------
    */

    const { auth } = usePage().props as {
        auth?: {
            user?: any;
        };
    };

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */
    return (
        <AppShell>
            <Head title="ERR_404: RESOURCE_NOT_FOUND" />

            <div className="relative mt-14 flex min-h-[70vh] flex-col items-center justify-center overflow-hidden p-6 md:mt-32">
                {/* --- BACKGROUND DECOR (Pattern a punti tecnico) --- */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(#80808020_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* --- ICONA LOST --- */}
                    <div className="mb-8 flex h-20 w-20 items-center justify-center border border-muted-foreground/20 bg-muted/5">
                        <SearchX className="animate-bounce-slow h-10 w-10 text-muted-foreground/40" />
                    </div>

                    {/* --- CODICE ERRORE --- */}
                    <div className="relative">
                        <h1 className="text-8xl font-black italic leading-none tracking-[calc(-0.05em)] text-foreground sm:text-9xl">
                            404
                        </h1>
                        {/* Overlay "Null" tipico dei glitch tecnici */}
                        <div className="absolute -right-4 -top-2 rotate-12 bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground">
                            NULL_PTR
                        </div>
                    </div>

                    <div className="mt-4 inline-block border border-border px-4 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                        Resource_Query_Failed
                    </div>

                    {/* --- MESSAGGIO --- */}
                    <div className="mt-12 max-w-sm space-y-4">
                        <div className="flex items-center justify-center gap-2 font-mono text-[11px] font-bold text-primary">
                            <Terminal size={12} />
                            <span>
                                Path: "
                                {typeof window !== 'undefined'
                                    ? window.location.pathname
                                    : '/unknown'}
                                "
                            </span>
                        </div>

                        <h2 className="text-xl font-black uppercase italic leading-tight tracking-tight">
                            The requested node does not exist in our current
                            registry.
                        </h2>

                        <p className="text-xs font-medium leading-relaxed tracking-wide text-muted-foreground/60">
                            La risorsa che stai cercando potrebbe essere stata
                            spostata, rinominata o non è mai stata registrata
                            nel sistema centrale.
                        </p>
                    </div>

                    {/* --- ACTIONS --- */}
                    <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="h-12 w-56 rounded-none border-foreground/20 bg-transparent text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-foreground hover:text-background"
                            >
                                <ArrowLeft className="mr-2 h-3 w-3" />
                                Return_to_Home
                            </Button>
                        </Link>

                        {auth?.user && (
                            <Link href={route('dashboard')}>
                                <Button
                                    variant="ghost"
                                    className="h-12 rounded-none px-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-50 hover:bg-primary/5 hover:opacity-100"
                                >
                                    System_Index
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* --- DECORAZIONE LATERALE (Codice finto) --- */}
                <div className="absolute bottom-10 right-10 hidden flex-col items-end opacity-10 lg:flex">
                    <span className="font-mono text-[9px] uppercase">
                        Search_Status: 0_Records
                    </span>
                    <span className="font-mono text-[9px] uppercase">
                        Memory_Dump: [FAILED]
                    </span>
                </div>
            </div>
        </AppShell>
    );
}
