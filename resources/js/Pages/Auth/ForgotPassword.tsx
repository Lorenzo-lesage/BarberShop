import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

// Components
import { Button } from '@/components/ui/button';
import { FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Forgot your password? No problem. Just let us know your
                    email address and we will email you a password reset link
                    that will allow you to choose a new one.
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="flex w-full max-w-sm items-center gap-2">
                        <Input
                            type="email"
                            placeholder="Type your email..."
                            id="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={processing}
                        >
                            Reset Password
                        </Button>
                    </div>
                    {errors.email && (
                        <FieldDescription className="text-red-600">
                            {errors.email}
                        </FieldDescription>
                    )}
                </form>
            </div>
        </GuestLayout>
    );
}
