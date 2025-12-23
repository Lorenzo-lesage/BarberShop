import { Head, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Save, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

// Layout & Interfaces
import Dashboard from '@/Layouts/Dashboard';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { OpeningHour, SaloonProps } from '@/interfaces/saloon';

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
    saloon: SaloonProps['saloon'];
    breadcrumbs: BreadcrumbItemType[];
    auth_user: string;
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
    const [exceptionToDelete, setExceptionToDelete] = useState<number | null>(
        null,
    );
    const [isMobile, setIsMobile] = useState(false);

    /**
     * Get initial hours
     * @returns
     */
    const getInitialHours = () => {
        const baseHours = saloon?.opening_hours || {};
        return DAYS.reduce(
            (acc, day) => ({
                ...acc,
                [day]: baseHours[day] || {
                    open: '09:00',
                    close: '18:00',
                    is_closed: false,
                },
            }),
            {} as Record<string, OpeningHour>,
        );
    };

    const { data, setData, post, processing } = useForm({
        name: saloon?.name || '',
        address: saloon?.address || '',
        opening_hours: getInitialHours(),
    });

    const {
        data: exceptionData,
        setData: setExceptionData,
        post: postException,
        reset: resetException,
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
     * @param e ù
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
            onSuccess: () => {
                resetException();
                setDateRange(undefined);
            },
        });
    };

    /**
     * Confirm Delete
     */
    const confirmDelete = () => {
        if (exceptionToDelete) {
            router.delete(
                route(
                    'dashboard.barber.saloon.exceptions.destroy',
                    exceptionToDelete,
                ),
                {
                    onSuccess: () => setExceptionToDelete(null),
                },
            );
        }
    };

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    return (
        <Dashboard breadcrumbs={breadcrumbs}>
            <Head title="Salon Configuration" />

            <div className="xs:px-0 mx-auto max-w-4xl space-y-6 px-0 pb-10 sm:px-4">
                {/* General Settings Card */}
                <div className="shadow-sm">
                    <CardTitle className="text-2xl">Salon Settings</CardTitle>
                    <CardDescription>
                        Update your salon's basic info and weekly schedule.
                    </CardDescription>
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
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
                                Weekly Schedule
                            </h3>
                            <div className="divide-y overflow-hidden rounded-md border">
                                {DAYS.map((day) => (
                                    <div
                                        key={day}
                                        className="flex flex-col justify-between gap-4 p-3 hover:bg-muted/30 sm:flex-row sm:items-center md:h-16"
                                    >
                                        {/* Mobile: Top Row (Day + Closed Switch) */}
                                        <div className="flex items-center justify-between sm:w-32">
                                            <span className="font-bold capitalize">
                                                {day}
                                            </span>
                                            <div className="flex items-center space-x-2 sm:hidden">
                                                <Checkbox
                                                    id={`closed-m-${day}`}
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
                                                    htmlFor={`closed-m-${day}`}
                                                    className="text-xs uppercase"
                                                >
                                                    Closed
                                                </Label>
                                            </div>
                                        </div>

                                        {/* Desktop Closed Switch + Time Pickers */}
                                        <div className="flex flex-1 items-center gap-4">
                                            <div className="hidden w-24 items-center space-x-2 sm:flex">
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
                                                    className="text-xs uppercase"
                                                >
                                                    Closed
                                                </Label>
                                            </div>

                                            {!data.opening_hours[day]
                                                .is_closed && (
                                                <div className="flex flex-1 items-center gap-2 duration-300 animate-in fade-in slide-in-from-left-2">
                                                    <Input
                                                        type="time"
                                                        className="h-9 w-full sm:w-32"
                                                        value={
                                                            data.opening_hours[
                                                                day
                                                            ].open
                                                        }
                                                        onChange={(e) =>
                                                            handleHourChange(
                                                                day,
                                                                'open',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <span className="text-muted-foreground">
                                                        to
                                                    </span>
                                                    <Input
                                                        type="time"
                                                        className="h-9 w-full sm:w-32"
                                                        value={
                                                            data.opening_hours[
                                                                day
                                                            ].close
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto"
                        >
                            <Save className="mr-2 h-4 w-4" /> Save Schedule
                        </Button>
                    </form>
                </div>

                <Separator />

                {/* Holidays Card */}
                <div>
                    <CardTitle>Vacations & Closures</CardTitle>
                    <CardDescription>
                        Block specific dates for holidays or emergencies.
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
                                        numberOfMonths={isMobile ? 1 : 2}
                                        disabled={(d) =>
                                            d <
                                            new Date(
                                                new Date().setHours(0, 0, 0, 0),
                                            )
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2 md:col-span-4">
                            <Label htmlFor="reason">Reason</Label>
                            <Input
                                id="reason"
                                placeholder="Vacation, Holiday..."
                                value={exceptionData.reason}
                                onChange={(e) =>
                                    setExceptionData('reason', e.target.value)
                                }
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Button
                                type="submit"
                                variant="destructive"
                                className="w-full"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add
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
                                            setExceptionToDelete(ex.id)
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
            </div>

            {/* Delete Confirmation */}
            <AlertDialog
                open={exceptionToDelete !== null}
                onOpenChange={(o) => !o && setExceptionToDelete(null)}
            >
                <AlertDialogContent className="max-w-[90vw] rounded-lg sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will reopen these dates for customer bookings
                            immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                        <AlertDialogCancel className="w-full sm:w-auto">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="w-full bg-destructive text-white sm:w-auto"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dashboard>
    );
}
