import { cn } from '@/lib/utils';
import { format, isBefore } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

// Components
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

// Icons
import {
    Calendar as CalendarIcon,
    Loader2,
    Plus,
    ShieldAlert,
    Trash2,
} from 'lucide-react';

// Interfaces
import { Saloon } from '@/interfaces/saloon';
import { VisitOptions } from '@inertiajs/core';

interface ExceptionForm {
    start_date: string;
    end_date: string;
    reason: string;
}

interface ExceptionManagerProps {
    saloon: Saloon | null;
    exceptionData: ExceptionForm;
    setExceptionData: {
        (data: ExceptionForm): void;
        <K extends keyof ExceptionForm>(key: K, value: ExceptionForm[K]): void;
    };
    postException: (url: string, options?: Partial<VisitOptions>) => void;
    resetException: (...fields: (keyof ExceptionForm)[]) => void;
    exceptionErrors: Partial<Record<keyof ExceptionForm, string>>;
    exceptionProcessing: boolean;
    exceptionIsDirty: boolean;
    setDeleteTarget: React.Dispatch<
        React.SetStateAction<{
            id: number;
            type: 'exception' | 'saloon' | 'photo';
        } | null>
    >;
}

export function ExceptionManager({
    saloon,
    exceptionData,
    setExceptionData,
    postException,
    setDeleteTarget,
    resetException,
    exceptionErrors,
    exceptionProcessing,
    exceptionIsDirty,
}: ExceptionManagerProps) {
    /*
    |-------------------------------------------------------------------
    | Data
    |-------------------------------------------------------------------
    */
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    const upcomingExceptions =
        saloon?.exceptions?.filter((ex) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const endDate = new Date(ex.end_date);
            return !isBefore(endDate, today);
        }) || [];

    const previousExceptions =
        saloon?.exceptions
            ?.filter((ex) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const endDate = new Date(ex.end_date);
                return isBefore(endDate, today);
            })
            .sort(
                (a, b) =>
                    new Date(b.start_date).getTime() -
                    new Date(a.start_date).getTime(),
            ) || [];

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
     * Resetta il form delle Ferie/Eccezioni e il calendario
     */
    const clearExceptionForm = () => {
        resetException();
        setDateRange(undefined);
    };

    const isMobile = window.innerWidth < 768;

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */
    return (
        <section className="space-y-6">
            <header>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    04_Operational_Overrides
                </h3>
                <p className="mt-1 text-[9px] uppercase text-muted-foreground">
                    Exceptions_And_Closures_Log
                </p>
            </header>

            <form
                onSubmit={addException}
                className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end"
            >
                {/* Dates Selector */}
                <div className="space-y-2 md:col-span-5">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                        Timeframe_Node
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'h-11 w-full justify-start rounded-none border-border/60 bg-transparent text-left font-mono text-[10px] uppercase transition-all focus:ring-primary',
                                    !dateRange && 'text-muted-foreground/40',
                                    (exceptionErrors.start_date ||
                                        exceptionErrors.end_date) &&
                                        'border-destructive',
                                )}
                            >
                                <CalendarIcon className="mr-2 h-3 w-3 text-primary" />
                                {dateRange?.from
                                    ? dateRange.to
                                        ? `${format(dateRange.from, 'dd/MM')} — ${format(dateRange.to, 'dd/MM/yy')}`
                                        : format(dateRange.from, 'dd/MM/yy')
                                    : 'Select_Date_Range'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto rounded-none border-border/60 bg-background p-0"
                            align="start"
                        >
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={handleDateSelect}
                                numberOfMonths={isMobile ? 1 : 2}
                                disabled={(d) =>
                                    d <
                                    new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                className="rounded-none font-mono"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Reason Input */}
                <div className="space-y-2 md:col-span-4">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                        Log_Reason
                    </Label>
                    <Input
                        placeholder="SYSTEM_OFFLINE_REASON..."
                        className={cn(
                            'h-11 rounded-none border-border/60 bg-transparent font-mono text-[10px] uppercase focus-visible:ring-primary',
                            exceptionErrors.reason && 'border-destructive',
                        )}
                        value={exceptionData.reason}
                        onChange={(e) =>
                            setExceptionData('reason', e.target.value)
                        }
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 md:col-span-3">
                    <Button
                        type="submit"
                        disabled={
                            exceptionProcessing || !exceptionData.start_date
                        }
                        className="h-11 flex-1 rounded-none bg-primary text-[10px] font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                    >
                        {exceptionProcessing ? (
                            <Loader2 className="animate-spin" size={14} />
                        ) : (
                            <>
                                <Plus className="mr-1 h-3 w-3" /> Inject
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={!exceptionIsDirty || exceptionProcessing}
                        onClick={clearExceptionForm}
                        className="h-11 w-11 rounded-none border-border/60 bg-transparent hover:bg-destructive hover:text-white"
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>

                {/* Errors */}
                {(exceptionErrors.start_date ||
                    exceptionErrors.end_date ||
                    exceptionErrors.reason) && (
                    <div className="flex items-center gap-1.5 px-1 py-1 text-destructive md:col-span-12">
                        <ShieldAlert size={10} />
                        <p className="text-[8px] font-black uppercase italic tracking-tighter">
                            Protocol_Error:{' '}
                            {exceptionErrors.start_date ||
                                exceptionErrors.end_date ||
                                exceptionErrors.reason}
                        </p>
                    </div>
                )}
            </form>

            {/* Upcoming List */}
            <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest text-primary">
                    Active_Overrides
                </Label>
                <div className="grid gap-2">
                    {upcomingExceptions.length > 0 ? (
                        upcomingExceptions.map((ex) => (
                            <div
                                key={ex.id}
                                className="group flex items-center justify-between border border-border/40 bg-muted/5 p-3 transition-colors hover:border-primary/50"
                            >
                                <div className="space-y-1">
                                    <p className="font-mono text-[10px] font-bold tracking-tighter">
                                        [
                                        {format(
                                            new Date(ex.start_date),
                                            'dd.MM.yy',
                                        )}{' '}
                                        <span className="text-primary">—</span>{' '}
                                        {format(
                                            new Date(ex.end_date),
                                            'dd.MM.yy',
                                        )}
                                        ]
                                    </p>
                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60">
                                        {ex.reason || 'No_Description'}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setDeleteTarget({
                                            id: ex.id,
                                            type: 'exception',
                                        })
                                    }
                                    className="h-8 w-8 rounded-none text-muted-foreground hover:bg-destructive hover:text-white"
                                >
                                    <Trash2 size={12} />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="border border-dashed border-border/40 p-4 text-center">
                            <p className="text-[9px] uppercase italic tracking-[0.2em] text-muted-foreground/40">
                                Zero_Scheduled_Closures
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* History List */}
            {previousExceptions.length > 0 && (
                <div className="space-y-3 opacity-40 transition-opacity hover:opacity-100">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                        Archived_Logs
                    </Label>
                    <div className="grid gap-2">
                        {previousExceptions.slice(0, 3).map((ex) => (
                            <div
                                key={ex.id}
                                className="flex items-center justify-between border border-border/20 bg-transparent p-2"
                            >
                                <p className="font-mono text-[9px] text-muted-foreground">
                                    {format(
                                        new Date(ex.start_date),
                                        'dd.MM.yy',
                                    )}{' '}
                                    —{' '}
                                    {format(new Date(ex.end_date), 'dd.MM.yy')}
                                </p>
                                <span className="text-[8px] uppercase tracking-widest text-muted-foreground/40">
                                    {ex.reason}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
