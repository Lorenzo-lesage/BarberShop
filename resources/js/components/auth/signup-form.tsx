import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

// Icons
import { Eye, EyeClosed, GalleryVerticalEnd } from 'lucide-react';
// Toast
import { toast } from 'sonner';

interface SignupFormProps {
    isBarber?: boolean;
    submitRoute: string;
}

export function SignupForm({ isBarber = false, submitRoute }: SignupFormProps) {
    /*
    |-----------------------------------------------------------
    | Data
    |-----------------------------------------------------------
    */

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_barber: isBarber,
    });

    /*
    |-----------------------------------------------------------
    | Hooks
    |-----------------------------------------------------------
    */

    useEffect(() => {
        setData('is_barber', isBarber);
    }, [isBarber, setData]);

    /*
    |-----------------------------------------------------------
    | Methods
    |-----------------------------------------------------------
    */

    /**
     * Handles the form submission.
     * @param e
     * @returns
     */
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name || !data.email || !data.password) {
            toast.error('Form incomplete', {
                description: 'Please fill in all the fields.',
            });
            return;
        }

        post(route(submitRoute), {
            // <-- qui usiamo la rotta dinamica
            onSuccess: () => {
                toast.success('Account created!', {
                    description: 'Welcome to BarberShop',
                });
            },
            onError: (errors) => {
                toast.error('Registration failed', {
                    description:
                        errors.email ||
                        errors.password ||
                        errors.name ||
                        'Check your credentials and try again.',
                });
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    /**
     * Handles OAuth Register redirection.
     * @param provider
     */
    const handleOAuthRegister = (provider: string) => {
        toast.loading(`Redirecting to ${provider}...`);

        setTimeout(() => {
            window.location.href = route('oauth.redirect', provider);
        }, 100);
    };

    /*
    |-----------------------------------------------------------
    | Render
    |-----------------------------------------------------------
    */

    return (
        <div className={cn('mx-auto flex w-full max-w-sm flex-col gap-6')}>
            <form onSubmit={submit}>
                <FieldGroup>
                    {/* Header */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd />
                            </div>
                        </div>
                        <h1 className="text-xl font-bold">
                            {isBarber
                                ? 'Collaborate with us'
                                : 'Create your account'}
                        </h1>

                        <FieldDescription>
                            Already registered?{' '}
                            <a href={route('login')}>Login</a>
                        </FieldDescription>
                    </div>

                    <input
                        type="hidden"
                        name="is_barber"
                        value={isBarber ? '1' : '0'}
                        onChange={(e) =>
                            setData('is_barber', e.target.value === '1')
                        }
                    />

                    {/* Name */}
                    <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && (
                            <FieldDescription className="text-red-600">
                                {errors.name}
                            </FieldDescription>
                        )}
                    </Field>

                    {/* Email */}
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && (
                            <FieldDescription className="text-red-600">
                                {errors.email}
                            </FieldDescription>
                        )}
                    </Field>

                    {/* Password */}
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <Eye className="size-5" />
                                ) : (
                                    <EyeClosed className="size-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <FieldDescription className="text-red-600">
                                {errors.password}
                            </FieldDescription>
                        )}
                    </Field>

                    {/* Confirm Password */}
                    <Field>
                        <FieldLabel htmlFor="password_confirmation">
                            Confirm Password
                        </FieldLabel>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirm ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                                onClick={() =>
                                    setShowPasswordConfirm(!showPasswordConfirm)
                                }
                            >
                                {showPasswordConfirm ? (
                                    <Eye className="size-5" />
                                ) : (
                                    <EyeClosed className="size-5" />
                                )}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <FieldDescription className="text-red-600">
                                {errors.password_confirmation}
                            </FieldDescription>
                        )}
                    </Field>

                    {/* Submit */}
                    <Field>
                        <Button type="submit" disabled={processing}>
                            {isBarber ? 'Join us' : 'Sign Up'}
                        </Button>
                    </Field>
                    <FieldSeparator>Or</FieldSeparator>
                    <Field className="grid gap-4 sm:grid-cols-2">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthRegister('GitHub')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                    fill="currentColor"
                                />
                            </svg>
                            Continue with GitHub
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthRegister('Google')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    fill="currentColor"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </Field>
                </FieldGroup>
            </form>

            <FieldDescription className="px-6 text-center">
                By creating an account, you agree to our{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
