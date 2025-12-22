import Dashboard from '@/Layouts/Dashboard'; // Il tuo layout Page o Dashboard
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { OpeningHour, SaloonProps } from '@/interfaces/saloon';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    saloon: SaloonProps['saloon']; // Accediamo direttamente all'oggetto saloon
    breadcrumbs: BreadcrumbItemType[];
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

export default function SaloonConfig({ saloon, breadcrumbs }: Props) {
    const getInitialHours = () => {
        const baseHours = saloon?.opening_hours || {};

        // Per ogni giorno, se non esiste nel DB, creiamo un default
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
    const { data, setData, post, processing, errors } = useForm({
        name: saloon?.name || '',
        address: saloon?.address || '',
        opening_hours: getInitialHours(), // Usa la funzione di inizializzazione sicura
    });

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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.barber.saloon.store'));
    };

    return (
        <Dashboard breadcrumbs={breadcrumbs}>
            <Head title="Configurazione Salone" />

            <div className="mx-auto max-w-4xl space-y-6">
                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-lg border bg-card p-6 shadow-sm"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium">
                                Nome Salone
                            </label>
                            <input
                                className="mt-1 w-full rounded border p-2 dark:bg-zinc-900"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                Indirizzo
                            </label>
                            <input
                                className="mt-1 w-full rounded border p-2 dark:bg-zinc-900"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="border-b pb-2 text-lg font-bold">
                            Orari di Apertura
                        </h3>
                        {DAYS.map((day) => (
                            <div
                                key={day}
                                className="flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-accent/50"
                            >
                                <span className="w-24 font-medium capitalize">
                                    {day}
                                </span>

                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={
                                            data.opening_hours[day].is_closed
                                        }
                                        onChange={(e) =>
                                            handleHourChange(
                                                day,
                                                'is_closed',
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <span className="text-sm">Chiuso</span>
                                </label>

                                {!data.opening_hours[day].is_closed && (
                                    <div className="flex items-center gap-2 duration-300 animate-in fade-in">
                                        <input
                                            type="time"
                                            className="rounded border p-1 dark:bg-zinc-800"
                                            value={data.opening_hours[day].open}
                                            onChange={(e) =>
                                                handleHourChange(
                                                    day,
                                                    'open',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <span>-</span>
                                        <input
                                            type="time"
                                            className="rounded border p-1 dark:bg-zinc-800"
                                            value={
                                                data.opening_hours[day].close
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
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-md bg-primary px-6 py-2 font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 md:w-auto"
                    >
                        {processing ? 'Salvataggio...' : 'Salva Configurazione'}
                    </button>
                </form>
            </div>
        </Dashboard>
    );
}
