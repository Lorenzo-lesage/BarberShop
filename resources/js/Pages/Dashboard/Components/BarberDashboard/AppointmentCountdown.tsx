import { useEffect, useState } from 'react';

export function AppointmentCountdown({ targetTime }: { targetTime: string }) {
    /*
    |-------------------------------------------------------------------
    | Data
    |-------------------------------------------------------------------
    */

    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    /*
    |-------------------------------------------------------------------
    | Hooks
    |-------------------------------------------------------------------
    */

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const [hours, minutes] = targetTime.split(':').map(Number);
            const target = new Date();
            target.setHours(hours, minutes, 0);

            const diff = Math.floor(
                (target.getTime() - now.getTime()) / 1000 / 60,
            );
            setTimeLeft(diff);
        };

        calculateTime();
        const interval = setInterval(calculateTime, 30000); // Aggiorna ogni 30 secondi
        return () => clearInterval(interval);
    }, [targetTime]);

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    if (timeLeft === null || timeLeft < 0 || timeLeft > 60) return null;

    return (
        <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-2 py-1 duration-500 animate-in fade-in slide-in-from-right-2">
            <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
            </span>
            <span className="font-mono text-[9px] font-black uppercase tracking-tighter text-primary">
                T-MINUS {timeLeft}m
            </span>
        </div>
    );
}
