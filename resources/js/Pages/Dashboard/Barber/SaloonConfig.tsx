import { Head, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

// Icons
import {
    Calendar as CalendarIcon,
    Loader2,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Interfaces
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { OpeningHour, Saloon } from '@/interfaces/saloon';

// Shadcn UI Components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Interfaces
interface Props {
    saloon: Saloon;
    breadcrumbs: BreadcrumbItemType[];
}

// Constants
const DAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];

export default function SaloonConfig({ saloon, breadcrumbs }: Props) {
    /*
    |-------------------------------------------------------------------
    | Data
    |-------------------------------------------------------------------
    */
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const [deleteTarget, setDeleteTarget] = useState<{
        id: number;
        type: 'exception' | 'saloon';
    } | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    /**
     * Get initial hours
     * @returns
     */
    const getInitialHours = () => {
        return DAYS.reduce(
            (acc, day) => ({
                ...acc,
                [day]: saloon?.opening_hours[day] || {
                    open: '09:00',
                    close: '18:00',
                    is_closed: false,
                },
            }),
            {} as Record<string, OpeningHour>,
        );
    };

    const { data, setData, post, processing, errors, isDirty, reset } = useForm(
        {
            name: saloon?.name || '',
            address: saloon?.address || '',
            opening_hours: getInitialHours(),
        },
    );

    const {
        data: exceptionData,
        setData: setExceptionData,
        post: postException,
        reset: resetException,
        errors: exceptionErrors,
        processing: exceptionProcessing,
        isDirty: exceptionIsDirty,
    } = useForm({
        start_date: '',
        end_date: '',
        reason: '',
    });

    /*
    |-------------------------------------------------------------------
    | Hooks
    |-------------------------------------------------------------------
    */

    // Monitor screen size for Calendar months
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    /*
    |-------------------------------------------------------------------
    | Methods
    |-------------------------------------------------------------------
    */

    /**
     * Handle date select
     * @param range
     */
    const handleDateSelect = (range: DateRange | undefined) => {
        setDateRange(range);
        setExceptionData({
            ...exceptionData,
            start_date: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
            end_date: range?.to
                ? format(range.to, 'yyyy-MM-dd')
                : range?.from
                  ? format(range.from, 'yyyy-MM-dd')
                  : '',
        });
    };

    /**
     * Handle hour change
     * @param day
     * @param field
     * @param value
     */
    const handleHourChange = (
        day: string,
        field: keyof OpeningHour,
        value: string | boolean,
    ) => {
        setData('opening_hours', {
            ...data.opening_hours,
            [day]: { ...data.opening_hours[day], [field]: value },
        });
    };

    /**
     * Submit Saloon
     * @param e
     */
    const submitSaloon = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.barber.saloon.store'));
    };

    /**
     * Submit Exception
     * @param e
     */
    const addException = (e: React.FormEvent) => {
        e.preventDefault();
        postException(route('dashboard.barber.saloon.exceptions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                resetException();
                setDateRange(undefined);
            },
        });
    };

    /**
     * Confirm Delete
     */
    const confirmGlobalDelete = () => {
        if (!deleteTarget) return;

        const routes = {
            exception: route(
                'dashboard.barber.saloon.exceptions.destroy',
                deleteTarget.id,
            ),
            saloon: route('saloon.destroy'),
        };

        router.delete(routes[deleteTarget.type], {
            preserveScroll: true,
            onStart: () => setIsDeleting(true), // Attiva il loading
            onSuccess: () => {
                setDeleteTarget(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    /**
     * Resetta il form delle Ferie/Eccezioni e il calendario
     */
    const clearExceptionForm = () => {
        resetException(); // Resetta start_date, end_date, reason
        setDateRange(undefined); // Pulisce la selezione sul calendario
    };

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    return (
        <Dashboard breadcrumbs={breadcrumbs}>
            <Head title="Saloon Configuration" />

            <div className="mx-auto w-full max-w-2xl space-y-6 px-0 pb-10 sm:px-4">
                {/* General Settings Card */}
                <div className="flex w-full flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">
                            Salon Settings
                        </CardTitle>
                        <CardDescription>
                            Update your salon's basic info and weekly schedule.
                        </CardDescription>
                    </div>

                    {saloon && (
                        <Button
                            variant="destructive"
                            size="sm" // Opzionale, per renderlo più discreto
                            onClick={() =>
                                setDeleteTarget({
                                    id: saloon.id,
                                    type: 'saloon',
                                })
                            }
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Saloon
                        </Button>
                    )}
                </div>
                <form onSubmit={submitSaloon} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Salon Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className={cn(
                                    errors.name &&
                                        'border-destructive focus-visible:ring-destructive',
                                )}
                            />
                            {errors.name && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                className={cn(
                                    errors.address &&
                                        'border-destructive focus-visible:ring-destructive',
                                )}
                            />
                            {errors.address && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
                            Weekly Schedule
                        </h3>
                        {errors.opening_hours && (
                            <span className="text-xs font-bold text-destructive">
                                {errors.opening_hours}
                            </span>
                        )}
                        <div className="divide-y overflow-hidden rounded-md border">
                            {DAYS.map((day) => (
                                <div
                                    key={day}
                                    className="flex h-28 flex-col justify-between gap-4 p-3 hover:bg-muted/30 sm:flex-row sm:items-center md:h-16"
                                >
                                    {/* Sinistra: Giorno + Checkbox (Desktop & Mobile) */}
                                    <div className="flex items-center justify-between sm:w-64 sm:justify-start sm:gap-6">
                                        <span className="w-20 font-bold capitalize">
                                            {day}
                                        </span>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`closed-${day}`}
                                                checked={
                                                    data.opening_hours[day]
                                                        .is_closed
                                                }
                                                onCheckedChange={(c) =>
                                                    handleHourChange(
                                                        day,
                                                        'is_closed',
                                                        !!c,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`closed-${day}`}
                                                className="text-xs font-semibold uppercase text-muted-foreground"
                                            >
                                                Closed
                                            </Label>
                                        </div>
                                    </div>

                                    {/* Destra: Solo Input Ore */}
                                    <div className="flex flex-1 items-center justify-end">
                                        {!data.opening_hours[day].is_closed && (
                                            <div className="flex items-center gap-2 duration-300 animate-in fade-in slide-in-from-right-2">
                                                <Input
                                                    type="time"
                                                    className={cn(
                                                        'h-9 w-[100px] bg-background text-center font-mono',
                                                        'dark:[&::-webkit-calendar-picker-indicator]:invert',
                                                        errors.opening_hours &&
                                                            'border-destructive',
                                                    )}
                                                    value={
                                                        data.opening_hours[day]
                                                            .open
                                                    }
                                                    onChange={(e) =>
                                                        handleHourChange(
                                                            day,
                                                            'open',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <span className="text-xs font-bold text-muted-foreground">
                                                    TO
                                                </span>
                                                <Input
                                                    type="time"
                                                    className={cn(
                                                        'h-9 w-[100px] bg-background text-center font-mono',
                                                        'dark:[&::-webkit-calendar-picker-indicator]:invert',
                                                        errors.opening_hours &&
                                                            'border-destructive',
                                                    )}
                                                    value={
                                                        data.opening_hours[day]
                                                            .close
                                                    }
                                                    onChange={(e) =>
                                                        handleHourChange(
                                                            day,
                                                            'close',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                        {data.opening_hours[day].is_closed && (
                                            <span className="pr-4 text-sm italic text-muted-foreground">
                                                No working hours
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-[140px]"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save
                                    Schedule
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset()}
                            disabled={processing || !isDirty}
                        >
                            Reset Form
                        </Button>
                    </div>
                </form>

                {saloon && (
                    <>
                        <Separator />
                        {/* Holidays Card */}
                        <div>
                            <CardTitle>Vacations & Closures</CardTitle>
                            <CardDescription>
                                Block specific dates for holidays or
                                emergencies.
                            </CardDescription>
                            <form
                                onSubmit={addException}
                                className="mt-3 flex flex-col gap-4 md:grid md:grid-cols-12 md:items-end"
                            >
                                <div className="space-y-2 md:col-span-5">
                                    <Label>Dates</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !dateRange &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-destructive" />
                                                {dateRange?.from ? (
                                                    dateRange.to ? (
                                                        `${format(dateRange.from, 'LLL dd')} - ${format(dateRange.to, 'LLL dd, y')}`
                                                    ) : (
                                                        format(
                                                            dateRange.from,
                                                            'LLL dd, y',
                                                        )
                                                    )
                                                ) : (
                                                    <span>Select range</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="range"
                                                selected={dateRange}
                                                onSelect={handleDateSelect}
                                                numberOfMonths={
                                                    isMobile ? 1 : 2
                                                }
                                                disabled={(d) =>
                                                    d <
                                                    new Date(
                                                        new Date().setHours(
                                                            0,
                                                            0,
                                                            0,
                                                            0,
                                                        ),
                                                    )
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {(exceptionErrors.start_date ||
                                        exceptionErrors.end_date) && (
                                        <p className="text-sm font-medium text-destructive">
                                            {exceptionErrors.start_date ||
                                                exceptionErrors.end_date}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2 md:col-span-4">
                                    <Label htmlFor="reason">Reason</Label>
                                    <Input
                                        id="reason"
                                        placeholder="Vacation, Holiday..."
                                        value={exceptionData.reason}
                                        onChange={(e) =>
                                            setExceptionData(
                                                'reason',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {exceptionErrors.reason && (
                                        <p className="text-sm font-medium text-destructive">
                                            {exceptionErrors.reason}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-1 md:col-span-3">
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        className="w-full p-2"
                                        disabled={
                                            exceptionProcessing ||
                                            !exceptionData.start_date
                                        }
                                    >
                                        {exceptionProcessing ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Plus className="mr-1" /> Add
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full p-2"
                                        disabled={
                                            !exceptionIsDirty ||
                                            exceptionProcessing
                                        }
                                        onClick={clearExceptionForm} // Collega la funzione qui
                                    >
                                        <Trash2 className="mr-1" /> Reset
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-5 space-y-3">
                                <h4 className="text-sm font-semibold uppercase text-muted-foreground">
                                    Upcoming Closures
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {saloon?.exceptions?.map((ex) => (
                                        <div
                                            key={ex.id}
                                            className="flex items-center justify-between rounded-lg border bg-muted/20 p-4"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold leading-none">
                                                    {format(
                                                        new Date(ex.start_date),
                                                        'PP',
                                                    )}{' '}
                                                    —{' '}
                                                    {format(
                                                        new Date(ex.end_date),
                                                        'PP',
                                                    )}
                                                </p>
                                                {ex.reason && (
                                                    <p className="text-xs italic text-muted-foreground">
                                                        {ex.reason}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDeleteTarget({
                                                        id: ex.id,
                                                        type: 'exception',
                                                    })
                                                }
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {saloon?.exceptions?.length === 0 && (
                                        <p className="py-4 text-center text-sm text-muted-foreground">
                                            No closures planned.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Delete Confirmation */}
            <AlertDialog
                open={deleteTarget !== null}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
            >
                <AlertDialogContent className="max-w-[90vw] rounded-lg sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget?.type === 'exception'
                                ? 'This action will immediately reopen these dates for customer bookings.'
                                : 'This will permanently delete your salon and all associated data. This action cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                        <AlertDialogCancel className="w-full sm:w-auto">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault(); // Evita che il dialog si chiuda prima della fine della richiesta
                                confirmGlobalDelete();
                            }}
                            // Usiamo la proprietà nativa dell'oggetto router
                            disabled={isDeleting}
                            className="w-full min-w-[110px] bg-destructive text-white hover:bg-destructive/90 sm:w-auto"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                `Delete ${deleteTarget?.type === 'saloon' ? 'Salon' : 'Closure'}`
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dashboard>
    );
}
