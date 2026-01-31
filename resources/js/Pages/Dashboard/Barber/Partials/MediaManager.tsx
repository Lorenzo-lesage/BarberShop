import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';

// Components
import SaloonImage from '@/components/saloon/SaloonImage';
import { Label } from '@/components/ui/label';

// Icons
import { Loader2, Plus, ShieldAlert, Trash2 } from 'lucide-react';

// Interfaces
import { Saloon, SaloonPhoto } from '@/interfaces/saloon';

interface MediaManagerProps {
    saloonPhotos: SaloonPhoto[];
    saloon: Saloon | null;
    setDeleteTarget: React.Dispatch<
        React.SetStateAction<{
            id: number;
            type: 'exception' | 'saloon' | 'photo';
        } | null>
    >;
}

export function MediaManager({ saloon, setDeleteTarget }: MediaManagerProps) {
    /*
    |-------------------------------------------------------------------
    | Data
    |-------------------------------------------------------------------
    */
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingPhotosCount, setUploadingPhotosCount] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [localErrors, setLocalErrors] = useState<{
        main_photo?: string;
        photos?: string;
    }>({});

    /*
    |-------------------------------------------------------------------
    | Methods
    |-------------------------------------------------------------------
    */

    /**
     * Elimina una foto
     * @param photoId
     */
    const deletePhoto = (photoId: number) => {
        setDeleteTarget({
            id: photoId,
            type: 'photo',
        });
    };

    /**
     * Upload istantaneo della Cover
     */
    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCover(true);
        router.post(
            route('dashboard.barber.saloon.cover.update', saloon?.id),
            {
                _method: 'patch',
                main_photo: file,
            },
            {
                forceFormData: true,
                onFinish: () => setUploadingCover(false),
                preserveScroll: true,
                onError: (err) => {
                    setLocalErrors(err);
                },
                onSuccess: () => {
                    setUploadingCover(false);
                    if (localErrors.main_photo)
                        setLocalErrors((prev) => ({
                            ...prev,
                            main_photo: undefined,
                        }));
                },
            },
        );
    };

    /**
     * Upload group imagines
     * @param files
     * @returns
     */
    const uploadFiles = (files: File[]) => {
        if (files.length === 0) return;

        // 1. Reset errori all'inizio del caricamento di gruppo
        setLocalErrors((prev) => ({ ...prev, photos: undefined }));

        // 2. VALIDAZIONE LATO CLIENT (Opzionale ma consigliata)
        const MAX_SIZE = 3 * 1024 * 1024; // 3MB
        const oversized = files.find((f) => f.size > MAX_SIZE);

        if (oversized) {
            setLocalErrors((prev) => ({
                ...prev,
                photos: `File "${oversized.name}" is too big. Max 3MB`,
            }));
            return; // Blocca tutto prima di iniziare gli upload
        }

        setUploadingPhotosCount(files.length);

        files.forEach((file) => {
            router.post(
                route('dashboard.barber.saloon.photos.store', saloon?.id),
                { photo: file },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onFinish: () =>
                        setUploadingPhotosCount((prev) =>
                            Math.max(0, prev - 1),
                        ),
                    onError: (err) => {
                        setLocalErrors((prev) => ({
                            ...prev,
                            photos: err.photo,
                        }));
                    },
                },
            );
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        uploadFiles(files);
    };

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    return (
        <section className="space-y-6">
            <header>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    03_Visual_Assets
                </h3>
                <p className="mt-1 text-[9px] uppercase text-muted-foreground">
                    External_Interface_Media
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Sezione Cover */}
                <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                        Main_Cover
                    </Label>
                    <div
                        className={cn(
                            'group relative aspect-video overflow-hidden border border-border/60 bg-muted/5',
                            localErrors.main_photo &&
                                'border-destructive bg-destructive/5 ring-1 ring-destructive',
                        )}
                    >
                        {saloon?.main_photo ? (
                            <SaloonImage
                                src={`/storage/${saloon.main_photo.path}`}
                                alt="Cover"
                                className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-muted-foreground/20">
                                <Plus size={32} strokeWidth={1} />
                            </div>
                        )}

                        {uploadingCover && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}

                        <label className="absolute bottom-0 right-0 cursor-pointer bg-primary p-3 text-primary-foreground transition-colors hover:bg-primary/90">
                            <Plus size={16} strokeWidth={3} />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                disabled={uploadingCover}
                            />
                        </label>
                    </div>
                    {localErrors.main_photo && (
                        <div className="flex items-center gap-1.5 px-1 py-1 text-destructive">
                            <ShieldAlert size={10} />
                            <p className="text-[8px] font-black uppercase italic tracking-tighter">
                                Error: {localErrors.main_photo}
                            </p>
                        </div>
                    )}
                </div>

                {/* Sezione Gallery */}
                <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                        Gallery_Nodes
                    </Label>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            'grid min-h-[120px] grid-cols-3 gap-2 border-2 border-dashed p-2 transition-all',
                            isDragging
                                ? 'border-primary bg-primary/5'
                                : localErrors.photos
                                  ? 'border-destructive bg-destructive/5 ring-1 ring-destructive'
                                  : 'border-border/90',
                            uploadingPhotosCount > 0 &&
                                'pointer-events-none opacity-50',
                        )}
                    >
                        {/* Add Button */}
                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center border border-border/60 text-muted-foreground/40 transition-colors hover:bg-muted/50 hover:text-primary">
                            <Plus size={20} />
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                accept="image/*"
                                onChange={(e) =>
                                    uploadFiles(
                                        Array.from(e.target.files || []),
                                    )
                                }
                            />
                        </label>

                        {/* Existing Photos */}
                        {saloon?.photos
                            ?.filter((p: SaloonPhoto) => !p.is_main)
                            .map((photo: SaloonPhoto) => (
                                <div
                                    key={photo.id}
                                    className="group relative aspect-square overflow-hidden border border-border/60"
                                >
                                    <SaloonImage
                                        src={`/storage/${photo.path}`}
                                        className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
                                        alt={photo.url}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => deletePhoto(photo.id)}
                                        className="absolute inset-0 flex items-center justify-center bg-destructive/90 opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <Trash2
                                            size={16}
                                            className="text-white"
                                        />
                                    </button>
                                </div>
                            ))}
                    </div>
                    {localErrors.photos && (
                        <div className="flex items-center gap-1.5 px-1 py-1 text-destructive">
                            <ShieldAlert size={10} />
                            <p className="text-[8px] font-black uppercase italic tracking-tighter">
                                Error: {localErrors.photos}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
