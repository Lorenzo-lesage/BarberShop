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

// Icons
import { Camera, Loader2 } from 'lucide-react';
export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    /*
    | --------------------------------------
    | Data
    | --------------------------------------
    */

    const user = usePage().props.auth.user as User;
    const [uploading, setUploading] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    // Form per Nome ed Email (PATCH)
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    /*
    | --------------------------------------
    | Methods
    | --------------------------------------
    */

    // Funzione per l'upload istantaneo della foto
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoError(null); // Resetta errori precedenti
        setUploading(true);

        router.post(
            route('profile.photo.update'),
            {
                _method: 'patch',
                photo: file,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setPhotoError(null);
                    // Qui puoi far scattare un toast di successo
                },
                onError: (errors) => {
                    // Inertia restituisce gli errori qui!
                    if (errors.photo) {
                        setPhotoError(errors.photo);
                    }
                },
                onFinish: () => setUploading(false),
            },
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    /*
    | --------------------------------------
    | Render
    | --------------------------------------
    */

    return (
        <section className={`${className} max-w-xl`}>
            <header>
                <h2 className="text-lg font-medium text-foreground">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Update your account's profile information and email address.
                </p>
            </header>

            {/* SEZIONE FOTO PROFILO - SEPARATA */}
            <div className="flex items-center gap-6 rounded-lg border bg-muted/30 p-4">
                <div className="group relative">
                    <Avatar className="h-24 w-24 border-2 border-background shadow-md">
                        <AvatarImage
                            src={
                                user.profile_photo
                                    ? `${window.location.origin}/storage/${user.profile_photo}`
                                    : undefined
                            }
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary text-xl text-primary-foreground">
                            {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                            <Camera className="h-4 w-4" />
                            {user.profile_photo
                                ? 'Change photo'
                                : 'Upload photo'}
                        </div>
                    </Label>
                    <Input
                        id="photo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                    />
                    {photoError && (
                        <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                            {photoError}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Square images work best. Max 2MB.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Name Field */}
                <div className="grid gap-2">
                    <Label
                        htmlFor="name"
                        className={errors.name ? 'text-destructive' : ''}
                    >
                        Name
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        className={
                            errors.name
                                ? 'border-destructive focus-visible:ring-destructive'
                                : ''
                        }
                    />
                    {errors.name && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div className="grid gap-2">
                    <Label
                        htmlFor="email"
                        className={errors.email ? 'text-destructive' : ''}
                    >
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        className={
                            errors.email
                                ? 'border-destructive focus-visible:ring-destructive'
                                : ''
                        }
                    />
                    {errors.email && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                            {errors.email}
                        </p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/30 dark:bg-yellow-900/10">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 font-medium underline transition-colors hover:text-yellow-900 dark:hover:text-yellow-100"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing} size="sm">
                        {processing ? 'Saving...' : 'Save'}
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-muted-foreground">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
