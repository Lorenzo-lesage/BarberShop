import SaloonImage from '@/components/saloon/SaloonImage';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader2, Plus, Trash2 } from 'lucide-react'; // <--- Mancava questo!

export function MediaManager({
    saloon,
    uploadingCover,
    handleCoverUpload,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    uploadFiles,
    deletePhoto,
    uploadingPhotosCount,
}: any) {
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
                    <div className="group relative aspect-video overflow-hidden border border-border/60 bg-muted/5">
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
                                : 'border-border/40',
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
                            ?.filter((p: any) => !p.is_main)
                            .map((photo: any) => (
                                <div
                                    key={photo.id}
                                    className="group relative aspect-square overflow-hidden border border-border/60"
                                >
                                    <SaloonImage
                                        src={`/storage/${photo.path}`}
                                        className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
                                        alt={photo.name}
                                    />
                                    <button
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
                </div>
            </div>
        </section>
    );
}
