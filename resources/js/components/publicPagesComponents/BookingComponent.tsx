import { Link, useForm, usePage } from '@inertiajs/react';
import { addMinutes, format, isBefore, parse, startOfDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { useCallback, useMemo, useState } from 'react';

// Icons
import { CalendarIcon, CheckCircle2, Clock, MapPin, User } from 'lucide-react';

// Shadcn UI
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Interfaces
import type { OpeningHour, SaloonProps } from '@/interfaces/saloon';

export default function BookingComponent({ saloon }: SaloonProps) {
    /*
    |-------------------------------------------------------------------
    | Data
    |-------------------------------------------------------------------
    */
    const { auth } = usePage().props;
    const isAuthenticated = !!auth.user;
    const authId = auth.user?.id;
    const isOwner = authId === saloon?.user_id;

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // 1. Check if the selected date is a holiday (exception)
    /**
     * Determine if the selected date is a holiday
     * @param date
     * @returns
     */
    const isHoliday = useCallback(
        (date: Date) => {
            return saloon.exceptions.some((ex) => {
                const start = startOfDay(new Date(ex.start_date));
                const end = startOfDay(new Date(ex.end_date));
                const current = startOfDay(date);
                return current >= start && current <= end;
            });
        },
        [saloon.exceptions],
    );

    // 2. Generate time slots based on saloon opening hours
    /**
     * Generate time slots based on saloon opening hours
     */
    const availableSlots = useMemo(() => {
        if (!selectedDate || isHoliday(selectedDate)) return [];

        const dayName = format(selectedDate, 'eeee', {
            locale: it,
        }).toLowerCase();
        const schedule = saloon.opening_hours[dayName];

        if (!schedule || schedule.is_closed) return [];

        const slots: string[] = [];
        let current = parse(schedule.open, 'HH:mm', selectedDate);
        const end = parse(schedule.close, 'HH:mm', selectedDate);

        while (isBefore(current, end)) {
            slots.push(format(current, 'HH:mm'));
            current = addMinutes(current, 30);
        }

        return slots;
    }, [selectedDate, saloon.opening_hours, isHoliday]);

    // 3. Booking form (will be used later for the actual POST)
    const { data, setData, post, processing } = useForm({
        saloon_id: saloon.id,
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        time: '',
    });

    /*
    |-------------------------------------------------------------------
    | Handlers
    |-------------------------------------------------------------------
    */

    /**
     * Handles the booking process
     * @returns
     */
    const handleBooking = () => {
        if (!selectedDate || !selectedTime) return;
        // Logic for booking will go here
        alert(
            `Booking requested for ${format(selectedDate, 'PPP', { locale: it })} at ${selectedTime}`,
        );
    };

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    return (
        <div className="grid grid-cols-1 gap-8">
            {/* LEFT COLUMN: Saloon Info & Hours */}
            <div className="space-y-6 lg:col-span-1">
                <header className="flex justify-between space-y-4">
                    <div>
                        <Badge
                            variant="outline"
                            className="border-primary text-primary"
                        >
                            Official Partner
                        </Badge>
                        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
                            {saloon.name}
                        </h1>
                        <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Barber: {saloon?.barber?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{saloon.address}</span>
                            </div>
                        </div>
                    </div>
                    {isOwner && (
                        <Link
                            href={route('dashboard.barber.saloon', saloon.id)}
                            className={buttonVariants({ variant: 'outline' })}
                        >
                            Edit
                        </Link>
                    )}
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Opening Hours</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y text-sm">
                        {Object.entries(saloon.opening_hours).map(
                            ([day, hours]: [string, OpeningHour]) => (
                                <div
                                    key={day}
                                    className="flex justify-between py-2 capitalize"
                                >
                                    <span
                                        className={cn(
                                            format(new Date(), 'eeee', {
                                                locale: it,
                                            }).toLowerCase() === day &&
                                                'font-bold text-primary',
                                        )}
                                    >
                                        {day}
                                    </span>
                                    <span className="font-mono text-muted-foreground">
                                        {hours.is_closed ? (
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px]"
                                            >
                                                CLOSED
                                            </Badge>
                                        ) : (
                                            `${hours.open} - ${hours.close}`
                                        )}
                                    </span>
                                </div>
                            ),
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* Sotto la Card degli Opening Hours */}
            {saloon.exceptions?.length > 0 && (
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-destructive">
                            <CalendarIcon className="h-4 w-4" />
                            Closing Days
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {saloon.exceptions.map((ex) => (
                                <li
                                    key={ex.id}
                                    className="text-xs text-muted-foreground"
                                >
                                    <span className="font-semibold text-foreground">
                                        {format(
                                            new Date(ex.start_date),
                                            'dd MMM',
                                        )}{' '}
                                        -{' '}
                                        {format(
                                            new Date(ex.end_date),
                                            'dd MMM',
                                        )}
                                    </span>
                                    {ex.reason && `: ${ex.reason}`}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {auth?.user ? (
                <>
                    {/* RIGHT COLUMN: Booking System */}
                    {!auth?.user?.is_barber && (
                        <div className="space-y-6 lg:col-span-2">
                            <Card className="border-2 border-primary/10 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Select Date & Time
                                    </CardTitle>
                                    <CardDescription>
                                        Pick a day to see available slots for
                                        your appointment.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {/* Calendar Section */}
                                    <div className="space-y-4">
                                        <Label className="text-base">
                                            1. Choose the date
                                        </Label>
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                setSelectedTime(null); // Reset time when date changes
                                            }}
                                            disabled={(date) =>
                                                isBefore(
                                                    date,
                                                    startOfDay(new Date()),
                                                ) || isHoliday(date)
                                            }
                                            className="w-full rounded-md border shadow-sm"
                                        />
                                        {isHoliday(selectedDate!) && (
                                            <p className="text-xs font-medium italic text-destructive">
                                                * The shop is closed for
                                                holidays on this date.
                                            </p>
                                        )}
                                    </div>

                                    {/* Time Slots Section */}
                                    <div className="space-y-4">
                                        <Label className="text-base">
                                            2. Choose the time
                                        </Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableSlots.length > 0 ? (
                                                availableSlots.map((slot) => (
                                                    <Button
                                                        key={slot}
                                                        variant={
                                                            selectedTime ===
                                                            slot
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        className={cn(
                                                            'w-full transition-all',
                                                            selectedTime ===
                                                                slot &&
                                                                'ring-2 ring-primary ring-offset-2',
                                                        )}
                                                        onClick={() =>
                                                            setSelectedTime(
                                                                slot,
                                                            )
                                                        }
                                                    >
                                                        {slot}
                                                    </Button>
                                                ))
                                            ) : (
                                                <div className="col-span-3 rounded-lg border bg-muted/20 py-10 text-center">
                                                    <p className="text-sm italic text-muted-foreground">
                                                        No availability for the
                                                        selected date.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {selectedTime && (
                                            <div className="pt-6 animate-in fade-in slide-in-from-top-4">
                                                <Separator className="mb-6" />
                                                <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                                                        <div>
                                                            <p className="text-sm font-bold">
                                                                Summary
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {format(
                                                                    selectedDate!,
                                                                    'PPPP',
                                                                    {
                                                                        locale: it,
                                                                    },
                                                                )}{' '}
                                                                at{' '}
                                                                {selectedTime}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="h-12 w-full text-lg shadow-lg hover:shadow-primary/20"
                                                    size="lg"
                                                    onClick={handleBooking}
                                                    disabled={
                                                        processing ||
                                                        !isAuthenticated
                                                    }
                                                >
                                                    {!isAuthenticated
                                                        ? 'Sign in to book'
                                                        : 'Confirm Appointment'}
                                                </Button>
                                                {!isAuthenticated && (
                                                    <p className="mt-2 text-center text-xs text-muted-foreground">
                                                        You need to sign in to
                                                        book an appointment
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center">
                    <p>You need to sign in to book an appointment</p>

                    <Link
                        href={route('login')}
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        Sign in
                    </Link>
                </div>
            )}
        </div>
    );
}
