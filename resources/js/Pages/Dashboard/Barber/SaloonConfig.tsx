import { Head, router, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

// Icons

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Components layout
import { DeleteAlertDialog } from '@/Pages/Dashboard/Barber/Partials/DeleteAlertDialog';
import { ExceptionManager } from '@/Pages/Dashboard/Barber/Partials/ExceptionManager';
import { GeneralSettings } from '@/Pages/Dashboard/Barber/Partials/GeneralSettings';
import { MediaManager } from '@/Pages/Dashboard/Barber/Partials/MediaManager';
import { ScheduleManager } from '@/Pages/Dashboard/Barber/Partials/ScheduleManager';
import { SubmitSalon } from '@/Pages/Dashboard/Barber/Partials/SubmitSalon';

// Shadcn UI Components
import { Separator } from '@/components/ui/separator';

// Interfaces
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { OpeningHour, Saloon, SaloonPhoto } from '@/interfaces/saloon';
interface Props {
    saloon: Saloon;
    saloonPhotos: SaloonPhoto[];
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

export default function SaloonConfig({
    saloon,
    breadcrumbs,
    saloonPhotos,
}: Props) {
    /*
    |-------------------------------------------------------------------
    | Data
    |-------------------------------------------------------------------
    */

    const [deleteTarget, setDeleteTarget] = useState<{
        id: number;
        type: 'exception' | 'saloon' | 'photo';
    } | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    /**
     * Get initial hours
     * @returns
     */
    const getInitialHours = () => {
        return DAYS.reduce(
            (acc, day) => {
                const rawHour = saloon?.opening_hours?.[day];

                // Creiamo una variabile booleana sicura
                // Se è "1" (stringa), 1 (numero) o true (booleano), diventa true.
                const isClosedSafe = rawHour
                    ? String(rawHour.is_closed) === '1' ||
                      rawHour.is_closed === true
                    : false;

                return {
                    ...acc,
                    [day]: {
                        open: rawHour?.open || '09:00',
                        close: rawHour?.close || '18:00',
                        is_closed: isClosedSafe,
                    },
                };
            },
            {} as Record<string, OpeningHour>,
        );
    };

    const { data, setData, post, processing, errors, isDirty, reset } = useForm(
        {
            name: saloon?.name || '',
            address: saloon?.address || '',
            city: saloon?.city || '',
            province: saloon?.province || '',
            region: saloon?.region || '',
            cap: saloon?.cap || '',
            opening_hours: getInitialHours(),
            main_photo: null as File | null, // Per la nuova cover
            gallery: [] as File[], // Per le nuove foto gallery
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
     * Submit Saloon (Update o Create)
     * @param e
     */
    const submitSaloon = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.barber.saloon.store'), {
            forceFormData: true, // Forza l'invio come multipart/form-data
            preserveScroll: true,
            onSuccess: () => {
                // Opzionale: puliamo i campi file dopo il caricamento riuscito
                setData((prev) => ({ ...prev, main_photo: null, gallery: [] }));
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
            photo: route(
                'dashboard.barber.saloon.photos.destroy',
                deleteTarget.id,
            ),
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

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    return (
        <Dashboard breadcrumbs={breadcrumbs}>
            <Head title="Saloon Configuration" />

            {/* Wrapper di Sezione Artisan */}
            <div className="relative border-l-[1px] border-primary/20 py-4 pl-6 transition-all hover:border-primary">
                {/* Label tecnica nell'angolo */}
                <div className="absolute -left-[1px] top-0 h-8 w-[1px] bg-primary" />

                <header className="mb-8 flex items-end justify-between">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-tighter text-primary/50">
                            Section_Code: SC-01
                        </span>
                        <h3 className="text-xl font-light tracking-tight text-foreground/90">
                            General{' '}
                            <span className="font-bold text-primary">
                                Configuration
                            </span>
                        </h3>
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-[0.2em] opacity-30">
                        v1.0_Stable
                    </div>
                </header>
            </div>

            <div className="mx-auto w-full max-w-2xl space-y-6 px-0 pb-10 sm:px-4">
                <form onSubmit={submitSaloon} className="space-y-6">
                    {/* --- GENERAL SETTINGS --- */}
                    <GeneralSettings
                        data={data}
                        setData={setData}
                        saloon={saloon}
                        errors={errors}
                        setDeleteTarget={setDeleteTarget}
                    />

                    <Separator />

                    {/* --- SALOON PHOTOS --- */}
                    {saloon && (
                        <MediaManager
                            saloon={saloon}
                            setDeleteTarget={setDeleteTarget}
                            saloonPhotos={saloonPhotos}
                        />
                    )}

                    <Separator />

                    {/* --- SCHEDULE MANAGER HOURS --- */}
                    <ScheduleManager
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    {/* --- SUBMIT AREA --- */}
                    <SubmitSalon
                        processing={processing}
                        isDirty={isDirty}
                        reset={reset}
                    />
                </form>

                {saloon && (
                    <>
                        <Separator />

                        {/* --- EXCEPTION MANAGER --- */}
                        <ExceptionManager
                            saloon={saloon}
                            exceptionData={exceptionData}
                            setExceptionData={setExceptionData}
                            postException={postException}
                            setDeleteTarget={setDeleteTarget}
                            resetException={resetException}
                            exceptionErrors={exceptionErrors}
                            exceptionProcessing={exceptionProcessing}
                            exceptionIsDirty={exceptionIsDirty}
                        />
                    </>
                )}
            </div>

            {/* --- DELETE CONFIRMATION --- */}
            <DeleteAlertDialog
                target={deleteTarget}
                isDeleting={isDeleting}
                onConfirm={confirmGlobalDelete}
                onClose={() => setDeleteTarget(null)}
            />
        </Dashboard>
    );
}
