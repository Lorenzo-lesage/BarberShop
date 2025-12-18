'use client';

import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
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

    return (
        <section className={`${className} max-w-xl`}>
            <header>
                <h2 className="text-lg font-medium text-foreground">
                    Update Password
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {/* Current Password */}
                <div className="grid gap-2">
                    <Label
                        htmlFor="current_password"
                        className={
                            errors.current_password ? 'text-destructive' : ''
                        }
                    >
                        Current Password
                    </Label>
                    <Input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        autoComplete="current-password"
                        className={
                            errors.current_password
                                ? 'border-destructive focus-visible:ring-destructive'
                                : ''
                        }
                    />
                    {errors.current_password && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                            {errors.current_password}
                        </p>
                    )}
                </div>

                {/* New Password */}
                <div className="grid gap-2">
                    <Label
                        htmlFor="password"
                        className={errors.password ? 'text-destructive' : ''}
                    >
                        New Password
                    </Label>
                    <Input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        autoComplete="new-password"
                        className={
                            errors.password
                                ? 'border-destructive focus-visible:ring-destructive'
                                : ''
                        }
                    />
                    {errors.password && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                    <Label
                        htmlFor="password_confirmation"
                        className={
                            errors.password_confirmation
                                ? 'text-destructive'
                                : ''
                        }
                    >
                        Confirm Password
                    </Label>
                    <Input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        autoComplete="new-password"
                        className={
                            errors.password_confirmation
                                ? 'border-destructive focus-visible:ring-destructive'
                                : ''
                        }
                    />
                    {errors.password_confirmation && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
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
