'use client';

import { Transition } from '@headlessui/react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

// Shadcn UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Interfaces
import { User } from '@/interfaces/auth';
import { cn } from '@/lib/utils';

// Icons
import { AlertCircle, Camera, CheckCircle2, Loader2 } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    /*
    |------------------------------------------
    | Data
    |------------------------------------------
    */

    const user = usePage().props.auth.user as User;
    const [uploading, setUploading] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    /*
    |------------------------------------------
    | ;Methods
    |------------------------------------------
    */

    /**
     * Handles the form submission.
     * @param e
     * @returns
     */
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoError(null);
        setUploading(true);

        router.post(
            route('profile.photo.update'),
            { _method: 'patch', photo: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setUploading(false),
                onError: (err) => err.photo && setPhotoError(err.photo),
            },
        );
    };

    /**
     * Handles the form submission.
     * @param e
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
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
                    Registry_01
                </h2>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                    Profile Information
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Maintain personal identification and system credentials.
                </p>
            </header>

            <div className="grid gap-12 md:grid-cols-[200px_1fr]">
                {/* LATO SINISTRO: FOTO PROFILO (Visual Identity) */}
                <div className="space-y-4">
                    <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Visual_ID
                    </Label>
                    <div className="group relative aspect-square w-full overflow-hidden border border-border bg-muted/20">
                        <Avatar className="h-full w-full rounded-none">
                            <AvatarImage
                                src={
                                    user.profile_photo
                                        ? `/storage/${user.profile_photo}`
                                        : undefined
                                }
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <AvatarFallback className="rounded-none bg-background text-2xl font-black">
                                {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {/* Overlay Upload */}
                        <label className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                            <Input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                disabled={uploading}
                            />
                            {uploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                            ) : (
                                <Camera className="h-6 w-6 text-white" />
                            )}
                        </label>
                    </div>
                    {photoError && (
                        <p className="text-[9px] font-bold uppercase italic tracking-tighter text-destructive">
                            {photoError}
                        </p>
                    )}
                </div>

                {/* LATO DESTRO: FORM DATI (Core Data) */}
                <form onSubmit={submit} className="space-y-8">
                    <div className="grid gap-6">
                        {/* Nome Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-[9px] font-black uppercase tracking-[0.3em]"
                            >
                                Full_Name
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="h-12 rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 text-sm font-bold uppercase tracking-widest focus-visible:border-primary focus-visible:ring-0"
                            />
                            {errors.name && (
                                <p className="text-[10px] font-bold uppercase italic text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-[9px] font-black uppercase tracking-[0.3em]"
                            >
                                System_Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="h-12 rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 text-sm font-bold uppercase tracking-widest focus-visible:border-primary focus-visible:ring-0"
                            />
                            {errors.email && (
                                <p className="text-[10px] font-bold uppercase italic text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Verification Banner */}
                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="flex items-start gap-4 border border-primary/20 bg-primary/5 p-4">
                            <AlertCircle
                                size={16}
                                className="mt-0.5 text-primary"
                            />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest">
                                    Verification Required
                                </p>
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="text-[9px] font-bold uppercase underline transition-colors hover:text-primary"
                                >
                                    Resend Credentials
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 pt-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-12 rounded-none px-10 text-[10px] font-black uppercase tracking-[0.3em]"
                        >
                            {processing ? 'Updating...' : 'Commit Changes'}
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
                                    Success
                                </span>
                            </div>
                        </Transition>
                    </div>
                </form>
            </div>
        </section>
    );
}
