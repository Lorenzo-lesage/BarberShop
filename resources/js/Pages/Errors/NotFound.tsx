import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';

export default function NotFound() {
    return (
        <>
            <Head title="404 — Not Found" />

            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md p-6 text-center shadow-md">
                    <CardContent>
                        <h1 className="text-6xl font-extrabold text-destructive">
                            404
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Oops! The page you are looking for does not exist.
                        </p>
                        <div className="mt-6">
                            <Link href="/">
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                >
                                    Go to Homepage
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
