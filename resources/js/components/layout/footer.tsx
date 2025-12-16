import { Link, router, usePage } from '@inertiajs/react';

// Components
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Icons
import { MessageCircleQuestionMark } from 'lucide-react';

export default function Footer() {
    /*
    |--------------------------
    | Data
    |--------------------------
    */

    const { auth } = usePage().props;

    /*
    |--------------------------
    | Render
    |--------------------------
    */

    return (
        <footer className="flex flex-col gap-2 p-4 text-center text-gray-700 dark:text-gray-200">
            {!auth?.user && (
                <div className="mb-5">
                    <p>Are you a barber?</p>
                    <p>
                        Join our team to manage your appointments and clients!
                    </p>
                    <Link href="/become-barber" className="text-sm underline">
                        <Button variant="outline" size="sm">
                            Click here to register as a Barber
                        </Button>
                    </Link>
                </div>
            )}

            {!auth?.user?.is_barber && auth?.user && (
                <div className="mb-5">
                    <p>Are you a barber?</p>
                    <p className="flex items-center justify-center gap-2">
                        Join our team to manage your appointments and clients!
                        <Tooltip>
                            <TooltipTrigger>
                                <span className="inline-block">
                                    <MessageCircleQuestionMark size={18} />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    By becoming a barber, you can manage your
                                    appointments, clients, and services more
                                    efficiently through our platform.
                                    <br />
                                    And your client dashboard won't be visible
                                    anymore.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.post(route('become.barber.request'))
                        }
                    >
                        Send request to change role to Barber
                    </Button>
                </div>
            )}
            <p className="text-sm text-black dark:text-white/70">
                Built with ♥ by{' '}
                <a
                    href="https://laravel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                >
                    Laravel
                </a>{' '}
                &{' '}
                <a
                    href="https://inertiajs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                >
                    Inertia.js
                </a>
            </p>
            <div className="text-sm text-black dark:text-white/70">
                &copy; {new Date().getFullYear()} BarberShop
            </div>
        </footer>
    );
}
