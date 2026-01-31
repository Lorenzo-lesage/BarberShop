// Components
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

// Interfaces
import { OpeningHour } from '@/interfaces/saloon';

export interface SaloonFormData {
    opening_hours: Record<string, OpeningHour>;
}
interface Props {
    data: SaloonFormData;
    setData: <K extends keyof SaloonFormData>(
        field: K,
        value: SaloonFormData[K],
    ) => void;
    errors: Partial<Record<keyof SaloonFormData, string>>;
}

export function ScheduleManager({ data, setData, errors }: Props) {
    /*
    |-------------------------------------------------------------------
    | Constants
    |-------------------------------------------------------------------
    */
    const DAYS = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];

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

    return (
        <section className="space-y-4">
            <header>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    02_Weekly_Schedule
                </h3>
                <p className="mt-1 text-[9px] uppercase text-muted-foreground">
                    Operational_Window_Config
                </p>
            </header>

            <div className="divide-y divide-border/60 border border-border/60">
                {DAYS.map((day) => (
                    <div
                        key={day}
                        className="group flex h-16 items-center justify-between p-4 transition-colors hover:bg-muted/10"
                    >
                        <div className="flex items-center gap-4">
                            <span className="w-20 font-mono text-[10px] font-black uppercase tracking-widest">
                                {day.slice(0, 3)}
                            </span>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={data.opening_hours[day].is_closed}
                                    onCheckedChange={(v) =>
                                        handleHourChange(day, 'is_closed', !!v)
                                    }
                                    className="rounded-none border-border/60 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                />
                                <span className="text-[8px] font-bold uppercase text-muted-foreground/50">
                                    OFF
                                </span>
                            </div>
                        </div>

                        {!data.opening_hours[day].is_closed ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-1">
                                <Input
                                    type="time"
                                    className="h-7 w-20 rounded-none border-border/40 bg-transparent font-mono text-[10px] focus-visible:ring-primary"
                                    value={data.opening_hours[day].open}
                                    onChange={(e) =>
                                        handleHourChange(
                                            day,
                                            'open',
                                            e.target.value,
                                        )
                                    }
                                />
                                <span className="text-[8px] font-black opacity-20">
                                    —
                                </span>
                                <Input
                                    type="time"
                                    className="h-7 w-20 rounded-none border-border/40 bg-transparent font-mono text-[10px] focus-visible:ring-primary"
                                    value={data.opening_hours[day].close}
                                    onChange={(e) =>
                                        handleHourChange(
                                            day,
                                            'close',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        ) : (
                            <span className="text-[8px] font-black uppercase italic tracking-widest text-muted-foreground/30">
                                System_Offline
                            </span>
                        )}
                    </div>
                ))}
            </div>
            {!errors.opening_hours && (
                <p className="text-[10px] font-black uppercase text-destructive">
                    {errors.opening_hours}
                </p>
            )}
        </section>
    );
}
