'use client';

import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Lock, Terminal } from 'lucide-react';

// Layout
import AppShell from '@/Layouts/Appshell';

// UI Components
import { Button } from '@/components/ui/button';

export default function Forbidden() {
    return (
        <AppShell>
            <Head title="ERR_403: ACCESS_RESTRICTED" />

            <div className="relative mt-14 flex min-h-[70vh] flex-col items-center justify-center overflow-hidden p-6 md:mt-32">
                {/* --- BACKGROUND DECOR (Sottile griglia tecnica) --- */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* --- ICONA SECURITY --- */}
                    <div className="mb-6 flex h-20 w-20 items-center justify-center border border-destructive/30 bg-destructive/5">
                        <Lock className="h-10 w-10 animate-pulse text-destructive" />
                    </div>

                    {/* --- CODICE ERRORE --- */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-[1px] w-8 bg-destructive/50" />
                            <h1 className="text-8xl font-black italic leading-none tracking-tighter text-foreground sm:text-9xl">
                                403
                            </h1>
                            <span className="h-[1px] w-8 bg-destructive/50" />
                        </div>

                        <div className="inline-block bg-destructive px-3 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-destructive-foreground">
                            Protocol_Violation
                        </div>
                    </div>

                    {/* --- MESSAGGIO --- */}
                    <div className="mt-12 max-w-sm space-y-4">
                        <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-muted-foreground/60">
                            <Terminal size={12} />
                            <span>System_Log: Unauthorized_Entry_Detected</span>
                        </div>

                        <h2 className="text-xl font-black uppercase italic leading-tight tracking-tight">
                            Your credentials do not grant access to this secure
                            node.
                        </h2>

                        <p className="text-xs font-medium leading-relaxed tracking-wide text-muted-foreground">
                            L'accesso alla risorsa richiesta è limitato dal
                            firewall interno. Se ritieni che si tratti di un
                            errore, contatta l'amministratore del registro.
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
                                Return_to_Base
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            onClick={() => window.location.reload()}
                            className="h-12 rounded-none px-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-50 hover:opacity-100"
                        >
                            Retry_Auth
                        </Button>
                    </div>
                </div>

                {/* --- FOOTER DECOR --- */}
                <div className="absolute bottom-10 left-10 hidden lg:block">
                    <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-muted-foreground/20">
                        IP_TRACE:{' '}
                        {typeof window !== 'undefined'
                            ? window.location.hostname
                            : 'LOCAL_NODE'}
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
