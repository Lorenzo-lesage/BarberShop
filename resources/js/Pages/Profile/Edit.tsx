import AppShell from '@/Layouts/Appshell';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ShieldCheck, Trash2, User } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function ProfileEdit({
    mustVerifyEmail,
    status,
    isOAuth,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    isOAuth: boolean;
}>) {
    const { auth } = usePage().props;

    return (
        <AppShell>
            <Head title="Account Settings | Artisan Standard" />

            {/* --- HEADER EDITORALE --- */}
            <header className="border-b border-border bg-background/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-6 py-4 md:px-12">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                        {/* Sinistra: Titolo Compatto */}
                        <div className="flex items-baseline gap-4">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter sm:text-3xl">
                                Identity
                                <span className="ml-2 text-primary opacity-30">
                                    / Management
                                </span>
                            </h2>
                            <span className="hidden text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 sm:block">
                                System_v2.0
                            </span>
                        </div>

                        {/* Destra: Metadati sulla stessa linea */}
                        <div className="flex items-center gap-6">
                            <div className="hidden h-[1px] w-12 bg-border lg:block" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                                Registry Verified — 2026
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="py-20">
                <div className="mx-auto max-w-7xl space-y-24 px-6 md:px-12">
                    {/* SECTION: PROFILE INFORMATION */}
                    <section className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                        <aside className="space-y-4 lg:col-span-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 text-primary">
                                    <User size={20} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em]">
                                    Personal Profile
                                </h3>
                            </div>
                            <p className="text-xs uppercase leading-relaxed tracking-widest text-muted-foreground">
                                Update your account's profile information and
                                email address. Ensure your identity is accurate
                                for professional sessions.
                            </p>
                        </aside>

                        <div className="border border-border bg-card/30 p-8 md:p-12 lg:col-span-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    </section>

                    <hr className="border-border/50" />

                    {/* SECTION: PASSWORD UPDATE (Solo se non OAuth) */}
                    {!isOAuth && (
                        <section className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                            <aside className="space-y-4 lg:col-span-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-3 text-primary">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em]">
                                        Security Protocol
                                    </h3>
                                </div>
                                <p className="text-xs uppercase leading-relaxed tracking-widest text-muted-foreground">
                                    Ensure your account is using a long, random
                                    password to stay secure within the artisan
                                    network.
                                </p>
                            </aside>

                            <div className="border border-border bg-card/30 p-8 md:p-12 lg:col-span-8">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>
                        </section>
                    )}

                    {/* SECTION: DELETE ACCOUNT */}
                    <section className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-12">
                        <aside className="space-y-4 lg:col-span-4">
                            <div className="flex items-center gap-4 text-destructive">
                                <div className="bg-destructive/10 p-3">
                                    <Trash2 size={20} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em]">
                                    Danger Zone
                                </h3>
                            </div>
                            <p className="text-xs uppercase leading-relaxed tracking-widest text-muted-foreground">
                                Permanently delete your account and all
                                associated data. This action is irreversible.
                            </p>
                        </aside>

                        <div className="border border-destructive/20 bg-destructive/5 p-8 md:p-12 lg:col-span-8">
                            <DeleteUserForm
                                className="max-w-xl"
                                isOAuth={isOAuth}
                            />
                        </div>
                    </section>
                </div>
            </div>

            {/* Decorazione di fondo */}
            <div className="pointer-events-none fixed bottom-10 right-10 hidden select-none opacity-[0.03] lg:block">
                <span className="text-[10vw] font-black uppercase leading-none tracking-tighter">
                    {auth?.user?.name}
                </span>
            </div>
        </AppShell>
    );
}
