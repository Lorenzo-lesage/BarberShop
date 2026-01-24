import { cn } from '@/lib/utils';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { addMinutes, format, isBefore, parse, startOfDay } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

// Icons
import {
    CalendarIcon,
    CheckCircle2,
    Clock,
    Loader2,
    MapPin,
    User,
} from 'lucide-react';

// Shadcn UI
import SaloonImage from '@/components/saloon/SaloonImage';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

// Interfaces
import type { Saloon } from '@/interfaces/saloon';

interface Props {
    saloon: Saloon;
}

const DAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];

export default function BookingComponent({ saloon }: Props) {
    /*
    |-------------------------------------------------------------------
    | Data
    |-------------------------------------------------------------------
    */
    const { auth } = usePage().props;
    const isAuthenticated = !!auth.user;
    const authId = auth.user?.id;
    const isOwner = authId === saloon?.user_id;
    const galleryPhotos = saloon.photos?.filter((p) => !p.is_main) || [];

    const [selectedIndex, setSelectedIndex] = useState(0);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

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

        const dayName = format(selectedDate, 'eeee').toLowerCase();
        const schedule = saloon.opening_hours[dayName];

        if (
            !schedule ||
            schedule.is_closed ||
            !schedule.open ||
            !schedule.close
        )
            return [];

        const slots: string[] = [];
        let current = parse(schedule.open, 'HH:mm', selectedDate);
        const end = parse(schedule.close, 'HH:mm', selectedDate);

        let adjustedEnd = end;
        if (isBefore(end, current)) {
            adjustedEnd = addMinutes(end, 24 * 60);
        }

        while (isBefore(current, adjustedEnd)) {
            // Ora pushiamo SEMPRE lo slot, senza filtrare qui
            slots.push(format(current, 'HH:mm'));
            current = addMinutes(current, 30);
        }

        return slots;
    }, [selectedDate, saloon.opening_hours, isHoliday]);

    // 3. Booking form (will be used later for the actual POST)
    const { processing } = useForm({
        saloon_id: saloon.id,
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        time: '',
    });

    /**
     * Upcoming Exceptions
     */
    const upcomingExceptions = useMemo(() => {
        const today = startOfDay(new Date());
        return (
            saloon.exceptions?.filter((ex) => {
                const endDate = new Date(ex.end_date);
                // Teniamo l'eccezione se la data di fine è oggi o nel futuro
                return !isBefore(endDate, today);
            }) || []
        );
    }, [saloon.exceptions]);

    /**
     * Determine if a day is closed
     * @param date
     * @returns
     */
    const isWeeklyClosed = useCallback(
        (date: Date) => {
            if (!saloon.opening_hours) return true;

            const dayIndex = date.getDay(); // 0 = sunday
            const dayKey = DAYS[(dayIndex + 6) % 7];
            // 👆 converte JS (sunday=0) in monday-first

            const schedule = saloon.opening_hours[dayKey];

            return !schedule || schedule.is_closed;
        },
        [saloon.opening_hours],
    );

    /**
     * Determine if a date is disabled
     */
    const isDateDisabled = useCallback(
        (date: Date) => {
            // Giorni passati
            if (isBefore(date, startOfDay(new Date()))) return true;

            // Ferie
            if (isHoliday(date)) return true;

            // Giorni settimanali chiusi
            if (isWeeklyClosed(date)) return true;

            return false;
        },
        [isHoliday, isWeeklyClosed],
    );

    /*
    |-------------------------------------------------------------------
    | Statistics Logic
    |-------------------------------------------------------------------
    */

    const stats = useMemo(() => {
        // Usiamo startOfHour o semplicemente la data attuale
        const now = new Date();

        if (!saloon.appointments) return null;

        // 1. Filtriamo solo gli appuntamenti che sono REALMENTE passati
        const pastAppointments = saloon.appointments.filter((app) => {
            const appDate = new Date(app.appointment_time);

            // Verifica che la data sia valida e precedente a "ora"
            // Aggiungiamo un controllo per evitare errori se app.appointment_time è nullo
            return app.appointment_time && isBefore(appDate, now);
        });

        // 2. Ordiniamo per data decrescente
        const sortedPast = [...pastAppointments].sort(
            (a, b) =>
                new Date(b.appointment_time).getTime() -
                new Date(a.appointment_time).getTime(),
        );

        // --- LATO BARBIERE (Proprietario) ---
        if (isOwner) {
            // Il barbiere vede le statistiche di tutti i suoi clienti (nel suo salone)
            const confirmed = sortedPast.filter(
                (a) => a.status === 'confirmed',
            ).length;
            const cancelled = sortedPast.filter(
                (a) => a.status === 'cancelled',
            ).length;
            const lastApp = sortedPast.length > 0 ? sortedPast[0] : null;

            return {
                type: 'barber',
                total: sortedPast.length,
                confirmed,
                cancelled,
                lastDate: lastApp ? new Date(lastApp.appointment_time) : null,
            };
        }

        // --- LATO CLIENTE ---
        if (isAuthenticated && !auth.user.is_barber) {
            // Il cliente vede solo la SUA storia in questo salone
            const myPast = sortedPast.filter(
                (a) => Number(a.client_id) === Number(authId),
            );

            const confirmed = myPast.filter(
                (a) => a.status === 'confirmed',
            ).length;
            const cancelled = myPast.filter(
                (a) => a.status === 'cancelled',
            ).length;
            const lastApp = myPast.length > 0 ? myPast[0] : null;

            return {
                type: 'client',
                total: myPast.length,
                confirmed,
                cancelled,
                lastDate: lastApp ? new Date(lastApp.appointment_time) : null,
            };
        }

        return null;
    }, [saloon.appointments, isOwner, isAuthenticated, authId, auth.user]);

    console.log('Stats:', stats);

    /*
    |-------------------------------------------------------------------
    | Handlers
    |-------------------------------------------------------------------
    */

    /**
     * Handles date change
     * @param date
     */
    const handleDateChange = (date: Date | undefined) => {
        setIsCalculating(true); // Inizia il caricamento
        setSelectedDate(date);
        setSelectedTime(null); // Resetta l'ora

        // Simuliamo il calcolo/richiesta al database
        setTimeout(() => {
            setIsCalculating(false); // Fine caricamento
        }, 300);
    };

    /**
     * Handles the booking process
     * @returns
     */
    const handleBooking = () => {
        if (!selectedDate || !selectedTime) return;

        const appointmentDate = format(selectedDate, 'yyyy-MM-dd');
        const fullDateTime = `${appointmentDate} ${selectedTime}:00`;

        // Opzione A: Passare i dati manualmente (bypassando lo stato del form)
        // Usiamo il metodo router.post invece di post del form se non vogliamo sincronizzare lo stato

        router.post(
            route('appointments.store'),
            {
                saloon_id: saloon.id,
                barber_id: saloon.user_id,
                appointment_time: fullDateTime,
            },
            {
                onSuccess: () => setSelectedTime(null),
                preserveScroll: true,
            },
        );
    };

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    return (
        <>
            <div className="gap-8">
                {/* LEFT COLUMN: Saloon Info & Hours */}
                <div className="space-y-16 py-10">
                    {/* --- SALOON HEADER: THE IDENTITY --- */}
                    <header className="flex flex-col justify-between gap-10 border-b border-border pb-12 lg:flex-row lg:items-end">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant="outline"
                                    className="border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary"
                                >
                                    Official Partner
                                </Badge>
                                {isOwner && (
                                    <Link
                                        href={route(
                                            'dashboard.barber.saloon',
                                            saloon.id,
                                        )}
                                        className="text-[10px] font-bold uppercase tracking-widest underline decoration-primary/30 underline-offset-8 transition-colors hover:decoration-primary"
                                        prefetch
                                    >
                                        Edit Studio
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl font-black uppercase italic leading-[0.85] tracking-tighter sm:text-7xl md:text-8xl">
                                    {saloon.name}
                                </h1>
                                <div className="flex flex-col gap-6 pt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground md:flex-row md:items-center">
                                    <div className="flex items-center gap-2">
                                        <User
                                            size={16}
                                            className="text-primary"
                                        />
                                        <span>
                                            Master Barber:{' '}
                                            <span className="text-foreground">
                                                {saloon?.barber?.name}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            size={16}
                                            className="text-primary"
                                        />
                                        <span>
                                            {saloon.city}, {saloon.address} (
                                            {saloon.province}) {saloon.region}{' '}
                                            {saloon.cap}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="group relative self-start lg:self-end">
                            <div className="absolute -inset-2 bg-primary/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                            <Avatar className="h-32 w-32 rounded-none border border-border bg-muted ring-offset-background transition-transform group-hover:scale-[1.02]">
                                <SaloonImage
                                    src={`/storage/${saloon?.barber?.profile_photo}`}
                                    alt={saloon?.barber?.name}
                                />
                            </Avatar>
                        </div>
                    </header>

                    {/* --- ANALYTICS: BUSINESS OVERVIEW --- */}
                    {stats && (
                        <section className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
                            {[
                                {
                                    label: 'Total Sessions',
                                    value: stats.total,
                                    color: 'text-foreground',
                                },
                                {
                                    label: 'Confirmed',
                                    value: stats.confirmed,
                                    color: 'text-emerald-500',
                                },
                                {
                                    label: 'Cancelled',
                                    value: stats.cancelled,
                                    color: 'text-destructive',
                                },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="space-y-2 bg-background p-8"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                                        {stat.label}
                                    </span>
                                    <p
                                        className={cn(
                                            'text-5xl font-black tracking-tighter',
                                            stat.color,
                                        )}
                                    >
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                            <div className="col-span-full flex items-center justify-between border-t border-border bg-muted/20 px-8 py-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Last activity recorded
                                </span>
                                <span className="text-[11px] font-black uppercase italic">
                                    {stats.lastDate
                                        ? format(stats.lastDate, 'dd MMM yyyy')
                                        : 'First Session Pending'}
                                </span>
                            </div>
                        </section>
                    )}

                    {/* --- GALLERY: VISUAL STANDARDS --- */}
                    {galleryPhotos.length > 0 && (
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                                    The Atmosphere
                                </h2>
                                <div className="ml-8 h-[1px] flex-1 bg-border" />
                            </div>

                            <Dialog>
                                <div className="relative w-full">
                                    <Carousel
                                        className="w-full"
                                        opts={{ align: 'start', loop: true }}
                                    >
                                        <CarouselContent className="-ml-2 md:-ml-4">
                                            {galleryPhotos.map(
                                                (photo, index) => (
                                                    <CarouselItem
                                                        key={photo.id}
                                                        className="basis-[38%] pl-2 sm:basis-[29%] md:basis-[33.333%] lg:basis-[28%] xl:basis-[22%]"
                                                    >
                                                        <DialogTrigger
                                                            asChild
                                                            onClick={() =>
                                                                setSelectedIndex(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <div className="group relative aspect-[4/5] cursor-none overflow-hidden border border-border bg-muted">
                                                                <SaloonImage
                                                                    src={`/storage/${photo.path}`}
                                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                    alt={
                                                                        saloon?.name
                                                                    }
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                                    <span className="border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                                                                        View
                                                                        Frame
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </DialogTrigger>
                                                    </CarouselItem>
                                                ),
                                            )}
                                        </CarouselContent>
                                        <div className="hidden md:block">
                                            <CarouselPrevious className="left-4 h-12 w-12 rounded-none border-white/10 bg-black/50 text-white backdrop-blur-md hover:bg-primary hover:text-primary-foreground" />
                                            <CarouselNext className="right-4 h-12 w-12 rounded-none border-white/10 bg-black/50 text-white backdrop-blur-md hover:bg-primary hover:text-primary-foreground" />
                                        </div>
                                    </Carousel>
                                </div>

                                <DialogContent className="h-[90vh] max-w-[95vw] border-none bg-background/95 p-0 shadow-none backdrop-blur-xl">
                                    <Carousel
                                        className="h-full w-full"
                                        opts={{ startIndex: selectedIndex }}
                                    >
                                        <CarouselContent>
                                            {galleryPhotos.map((p) => (
                                                <CarouselItem
                                                    key={p.id}
                                                    className="flex items-center justify-center"
                                                >
                                                    <img
                                                        src={`/storage/${p.path}`}
                                                        className="max-h-[85vh] w-full object-contain p-4"
                                                        alt="Studio Gallery"
                                                    />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-10 bg-foreground/10" />
                                        <CarouselNext className="right-10 bg-foreground/10" />
                                    </Carousel>
                                </DialogContent>
                            </Dialog>
                        </section>
                    )}

                    {/* --- LOGISTICS: SCHEDULE & EXCEPTIONS --- */}
                    <section className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <div className="border border-border bg-card/30">
                                <div className="border-b border-border p-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                                        Opening Schedule
                                    </h3>
                                </div>
                                <div className="divide-y divide-border/50 p-6">
                                    {DAYS.map((day) => {
                                        const hours = saloon.opening_hours[day];
                                        const isToday =
                                            format(
                                                new Date(),
                                                'eeee',
                                            ).toLowerCase() === day;
                                        if (!hours) return null;

                                        return (
                                            <div
                                                key={day}
                                                className={cn(
                                                    'flex justify-between py-4 transition-colors',
                                                    isToday
                                                        ? 'font-black italic text-primary'
                                                        : 'font-light text-foreground',
                                                )}
                                            >
                                                <span className="text-xs uppercase tracking-widest">
                                                    {day}
                                                </span>
                                                <span className="font-mono text-xs">
                                                    {hours.is_closed ? (
                                                        <span className="uppercase tracking-tighter opacity-40">
                                                            Day Off
                                                        </span>
                                                    ) : (
                                                        `${hours.open} — ${hours.close}`
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 lg:col-span-4">
                            {saloon.exceptions?.length > 0 && (
                                <div className="relative overflow-hidden border border-destructive/30 bg-destructive/5 p-8">
                                    <div className="absolute right-0 top-0 p-2 opacity-10">
                                        <CalendarIcon
                                            size={64}
                                            className="text-destructive"
                                        />
                                    </div>
                                    <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.4em] text-destructive">
                                        Service Alerts
                                    </h3>
                                    {upcomingExceptions.length === 0 ? (
                                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                                            No service interruptions scheduled.
                                        </p>
                                    ) : (
                                        <ul className="space-y-6">
                                            {upcomingExceptions.map((ex) => (
                                                <li
                                                    key={ex.id}
                                                    className="group"
                                                >
                                                    <p className="text-xs font-black uppercase tracking-tighter">
                                                        {format(
                                                            new Date(
                                                                ex.start_date,
                                                            ),
                                                            'dd MMM',
                                                        )}{' '}
                                                        —{' '}
                                                        {format(
                                                            new Date(
                                                                ex.end_date,
                                                            ),
                                                            'dd MMM',
                                                        )}
                                                    </p>
                                                    <p className="mt-1 text-[10px] uppercase italic text-muted-foreground/80">
                                                        {ex.reason ||
                                                            'Studio maintenance'}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            <div className="border border-border bg-muted/10 p-8">
                                <p className="text-[10px] uppercase leading-relaxed tracking-[0.15em] text-muted-foreground">
                                    Cancellations must be made at least 24 hours
                                    prior to your scheduled session. Late
                                    changes may incur technical service fees.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="py-12">
                    {auth?.user ? (
                        <>
                            {!auth?.user?.is_barber && (
                                <div className="lg:col-span-2">
                                    {/* --- THE BOOKING ENGINE --- */}
                                    <div className="border border-border bg-background shadow-2xl">
                                        {/* Header Tecnico */}
                                        <div className="flex items-center justify-between border-b border-border p-8">
                                            <div className="space-y-1">
                                                <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                                                    <Clock size={14} />
                                                    Session Scheduler
                                                </h3>
                                                <p className="text-xs font-light uppercase tracking-widest text-muted-foreground">
                                                    Precision booking for elite
                                                    grooming.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
                                            {/* --- STEP 1: CALENDAR --- */}
                                            <div className="space-y-8 p-8">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex h-6 w-6 items-center justify-center bg-foreground text-[10px] font-black text-background">
                                                        01
                                                    </span>
                                                    <Label className="text-[10px] font-black uppercase tracking-widest">
                                                        Select Date
                                                    </Label>
                                                </div>

                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={handleDateChange}
                                                    disabled={isDateDisabled}
                                                    className="mx-auto w-full border-none p-0"
                                                    classNames={{
                                                        day_selected:
                                                            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                                                        day_today:
                                                            'bg-muted text-foreground',
                                                        head_cell:
                                                            'text-muted-foreground font-black uppercase text-[10px] tracking-tighter',
                                                    }}
                                                />

                                                {isHoliday(selectedDate!) && (
                                                    <div className="border-l-2 border-destructive bg-destructive/5 p-4 transition-all animate-in fade-in slide-in-from-left-2">
                                                        <p className="text-[10px] font-bold uppercase tracking-tight text-destructive">
                                                            The studio is
                                                            currently on
                                                            seasonal break for
                                                            this date.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* --- STEP 2: TIME SLOTS --- */}
                                            <div className="space-y-8 bg-muted/5 p-8">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex h-6 w-6 items-center justify-center bg-foreground text-[10px] font-black text-background">
                                                        02
                                                    </span>
                                                    <Label className="text-[10px] font-black uppercase tracking-widest">
                                                        Select Timeframe
                                                    </Label>
                                                </div>

                                                <div className="grid grid-cols-3 gap-1">
                                                    {isCalculating ? (
                                                        [...Array(12)].map(
                                                            (_, i) => (
                                                                <Skeleton
                                                                    key={i}
                                                                    className="h-10 w-full rounded-none bg-border/50"
                                                                />
                                                            ),
                                                        )
                                                    ) : availableSlots.length >
                                                      0 ? (
                                                        availableSlots.map(
                                                            (slot) => {
                                                                const isOccupied =
                                                                    saloon.appointments?.some(
                                                                        (
                                                                            app,
                                                                        ) => {
                                                                            const dbTimeRaw =
                                                                                app.appointment_time;
                                                                            const dbHourMinute =
                                                                                dbTimeRaw.substring(
                                                                                    11,
                                                                                    16,
                                                                                );
                                                                            const dbDateOnly =
                                                                                dbTimeRaw.substring(
                                                                                    0,
                                                                                    10,
                                                                                );
                                                                            const selectedDayString =
                                                                                format(
                                                                                    selectedDate!,
                                                                                    'yyyy-MM-dd',
                                                                                );
                                                                            return (
                                                                                dbDateOnly ===
                                                                                    selectedDayString &&
                                                                                dbHourMinute ===
                                                                                    slot &&
                                                                                app.status !==
                                                                                    'cancelled'
                                                                            );
                                                                        },
                                                                    );

                                                                const slotDateTime =
                                                                    parse(
                                                                        slot,
                                                                        'HH:mm',
                                                                        selectedDate!,
                                                                    );
                                                                const isPast =
                                                                    isBefore(
                                                                        slotDateTime,
                                                                        new Date(),
                                                                    );
                                                                const isDisabled =
                                                                    isOccupied ||
                                                                    isPast;

                                                                return (
                                                                    <button
                                                                        key={
                                                                            slot
                                                                        }
                                                                        disabled={
                                                                            isDisabled
                                                                        }
                                                                        onClick={() =>
                                                                            setSelectedTime(
                                                                                slot,
                                                                            )
                                                                        }
                                                                        className={cn(
                                                                            'h-12 border text-[11px] font-black uppercase tracking-tighter transition-all duration-200',
                                                                            selectedTime ===
                                                                                slot
                                                                                ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]'
                                                                                : 'border-border bg-background text-foreground hover:border-primary/50',
                                                                            isDisabled &&
                                                                                'cursor-not-allowed border-transparent bg-muted/50 text-muted-foreground opacity-20 grayscale',
                                                                        )}
                                                                    >
                                                                        {slot}
                                                                    </button>
                                                                );
                                                            },
                                                        )
                                                    ) : (
                                                        <div className="col-span-3 border border-dashed border-border py-12 text-center">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                                                                No sessions
                                                                available for
                                                                this date.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Summary & Confirm */}
                                                <div
                                                    className={cn(
                                                        'pt-6 transition-all duration-500',
                                                        selectedTime &&
                                                            !isCalculating
                                                            ? 'translate-y-0 opacity-100'
                                                            : 'pointer-events-none translate-y-4 opacity-0',
                                                    )}
                                                >
                                                    <div className="mb-6 border-l-2 border-primary bg-primary/5 p-6">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                                Summary
                                                            </span>
                                                            <p className="text-xl font-black uppercase italic tracking-tighter">
                                                                {format(
                                                                    selectedDate!,
                                                                    'dd MMMM',
                                                                )}{' '}
                                                                <span className="text-primary">
                                                                    —
                                                                </span>{' '}
                                                                {selectedTime}
                                                            </p>
                                                            <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                                                                Professional
                                                                Grooming Session
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        className="group h-16 w-full rounded-none bg-primary text-xs font-black uppercase tracking-[0.3em] transition-all hover:bg-foreground hover:text-background"
                                                        onClick={handleBooking}
                                                        disabled={processing}
                                                    >
                                                        {processing ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                Secure
                                                                Appointment
                                                                <CheckCircle2 className="ml-3 h-4 w-4 transition-transform group-hover:scale-110" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* --- AUTH REDIRECT --- */
                        <div className="flex flex-col items-center justify-center space-y-8 border border-dashed border-border py-32 text-center">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                                    Identity Required
                                </h3>
                                <p className="text-xs font-light uppercase tracking-[0.2em] text-muted-foreground">
                                    Sign in to access the artisan network and
                                    schedule your session.
                                </p>
                            </div>
                            <Link
                                href={route('login')}
                                className={cn(
                                    buttonVariants({ variant: 'outline' }),
                                    'h-14 rounded-none border-foreground px-12 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-foreground hover:text-background',
                                )}
                            >
                                Login to Platform
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
