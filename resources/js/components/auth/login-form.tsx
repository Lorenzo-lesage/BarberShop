'use client';

import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
import { ArrowRight, Eye, EyeOff, Mail } from 'lucide-react';
// Toast
import { toast } from 'sonner';

export function LoginForm({
    className,
    canResetPassword = false,
}: {
    canResetPassword?: boolean;
    className?: string;
}) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
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
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () =>
                toast.success('ACCESS_GRANTED', {
                    description: 'Welcome back to the Registry.',
                }),
            onFinish: () => reset('password'),
        });
    };

    /**
     * Handles OAuth login redirection.
     * @param provider
     */
    const handleOAuthLogin = (provider: string) => {
        toast.loading(`BRIDGE_LINK: Connecting to ${provider}...`);
        setTimeout(() => {
            window.location.href = route('oauth.redirect', provider);
        }, 500);
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div
            className={cn(
                'mx-auto mt-14 flex w-full max-w-[400px] flex-col gap-10 py-10 md:mt-32',
                className,
            )}
        >
            {/* --- HEADER TECNICO --- */}
            <header className="relative space-y-2 border-l-4 border-primary pl-6">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">
                    Auth_Validation
                </div>
                <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter">
                    Login_System
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    Identify yourself to access the BarberShop network.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-8">
                <div className="space-y-6">
                    {/* Email Field */}
                    <div className="group space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary"
                        >
                            System_ID (Email)
                        </Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="identifer@domain.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="h-12 rounded-none border-x-0 border-b border-t-0 border-primary/40 bg-transparent px-0 text-sm font-bold tracking-widest placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-0"
                                required
                            />
                            <Mail
                                size={14}
                                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[10px] font-bold uppercase italic text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="group space-y-2">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password"
                                className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary"
                            >
                                Security_Key
                            </Label>
                            {canResetPassword && (
                                <a
                                    href={route('password.request')}
                                    className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/60 hover:text-primary hover:underline"
                                >
                                    Key_Recovery?
                                </a>
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="h-12 rounded-none border-x-0 border-b border-t-0 border-primary/40 bg-transparent px-0 text-sm font-bold tracking-[0.4em] focus-visible:border-primary focus-visible:ring-0"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-3 pt-2">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) =>
                                setData('remember', checked === true)
                            }
                            className="rounded-none border-muted-foreground/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                        />
                        <Label
                            htmlFor="remember"
                            className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-muted-foreground/60"
                        >
                            Maintain_Session
                        </Label>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-6 pt-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-14 w-full rounded-none bg-primary text-[11px] font-black uppercase tracking-[0.4em] text-primary-foreground hover:bg-primary/90"
                    >
                        {processing ? 'AUTHENTICATING...' : 'Execute_Login'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="relative flex items-center justify-center">
                        <span className="absolute bg-background px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                            External_Bridges
                        </span>
                        <div className="h-[1px] w-full bg-border" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthLogin('GitHub')}
                            className="rounded-none border-border text-[9px] font-black uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="currentColor"
                                aria-hidden="true"
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
                            onClick={() => handleOAuthLogin('Google')}
                            className="rounded-none border-border text-[9px] font-black uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    fill="currentColor"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>
                </div>
            </form>

            <footer className="text-center">
                <p className="text-[9px] font-bold uppercase leading-relaxed tracking-widest text-muted-foreground/40">
                    No identity found?{' '}
                    <a
                        href={route('register')}
                        className="text-primary underline underline-offset-4"
                    >
                        REGISTER_NEW_ID
                    </a>
                </p>
            </footer>
        </div>
    );
}
