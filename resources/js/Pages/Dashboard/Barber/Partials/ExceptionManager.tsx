import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';

export function ExceptionManager({
    saloon,
    exData,
    setExData,
    dateRange,
    setDateRange,
    onSubmit,
    onRemoveEx,
}: any) {
    return (
        <section className="space-y-8 border-t border-border/60 pt-8">
            <header>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-destructive">
                    04_System_Overrides
                </h3>
                <p className="mt-1 text-[9px] uppercase text-muted-foreground">
                    Holiday_&_Emergency_Locks
                </p>
            </header>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-11 justify-start rounded-none border-border/60 bg-transparent font-mono text-[10px] uppercase"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                {dateRange?.from
                                    ? `${format(dateRange.from, 'dd/MM')} — ${dateRange.to ? format(dateRange.to, 'dd/MM') : '...'}`
                                    : 'SELECT_RANGE'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto rounded-none border-border/60 p-0"
                            align="end"
                        >
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={(r) => {
                                    setDateRange(r);
                                    setExData((prev) => ({
                                        ...prev,
                                        start_date: r?.from
                                            ? format(r.from, 'yyyy-MM-dd')
                                            : '',
                                        end_date: r?.to
                                            ? format(r.to, 'yyyy-MM-dd')
                                            : r?.from
                                              ? format(r.from, 'yyyy-MM-dd')
                                              : '',
                                    }));
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    <Input
                        placeholder="REASON_OF_CLOSURE..."
                        value={exData.reason}
                        onChange={(e) => setExData('reason', e.target.value)}
                        className="h-11 rounded-none border-border/60 bg-transparent text-[10px] font-black uppercase tracking-widest"
                    />

                    <Button
                        type="submit"
                        className="h-11 rounded-none bg-destructive text-[10px] font-black uppercase tracking-widest hover:bg-destructive/90"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Initialize_Lock
                    </Button>
                </div>
            </form>

            <div className="space-y-4">
                <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                    Active_Locks_Registry
                </h4>
                <div className="space-y-2">
                    {saloon.exceptions?.map((ex: any) => (
                        <div
                            key={ex.id}
                            className="group flex items-center justify-between border border-border/40 bg-muted/5 p-3"
                        >
                            <div className="font-mono text-[9px] uppercase tracking-tighter">
                                <span className="text-primary">
                                    {format(
                                        new Date(ex.start_date),
                                        'dd.MM.yy',
                                    )}
                                </span>
                                <span className="mx-2 opacity-20"></span>
                                <span className="text-primary">
                                    {format(new Date(ex.end_date), 'dd.MM.yy')}
                                </span>
                                <span className="ml-4 italic opacity-40">
                                    {ex.reason}
                                </span>
                            </div>
                            <button
                                onClick={() => onRemoveEx(ex.id)}
                                className="text-muted-foreground/20 transition-colors hover:text-destructive"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
