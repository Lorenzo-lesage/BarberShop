import { cn } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
import { ShieldAlert, Trash2 } from 'lucide-react';

// Interfaces
import { Saloon } from '@/interfaces/saloon';
interface GeneralSettingsProps {
    data: {
        name: string;
        address: string;
        city: string;
        region: string;
        province: string;
        cap: string;
    };
    setData: (field: string, value: string) => void;
    errors: Partial<Record<string, string>>;
    saloon: Saloon | null;
    setDeleteTarget: React.Dispatch<
        React.SetStateAction<{
            id: number;
            type: 'exception' | 'saloon' | 'photo';
        } | null>
    >;
}

export function GeneralSettings({
    data,
    setData,
    errors,
    saloon,
    setDeleteTarget,
}: GeneralSettingsProps) {
    return (
        <div className="space-y-8 duration-500 animate-in fade-in">
            {/* --- HEADER SECTOR --- */}
            <header className="flex flex-col justify-between gap-4 border-b border-border/40 pb-5 md:flex-row md:items-end">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                        01_Primary_Information
                    </h3>
                    <p className="mt-1 text-[9px] font-medium uppercase tracking-widest text-muted-foreground/60">
                        Registry_Data_Entry_Node
                    </p>
                </div>
                {saloon && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            setDeleteTarget({
                                id: saloon.id,
                                type: 'saloon',
                            })
                        }
                        type="button"
                        className="h-8 w-[50%] rounded-none border border-destructive/20 bg-destructive/5 px-3 text-[9px] font-black uppercase tracking-widest text-destructive transition-all hover:bg-destructive hover:text-white md:w-auto"
                    >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Terminate_Saloon
                    </Button>
                )}
            </header>

            <div className="space-y-6">
                {/* ---- SECTION: IDENTITY ---- */}
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
                            Salon_Identity_Tag
                        </Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="NAME_REQUIRED"
                            className={cn(
                                'h-11 rounded-none border-foreground/30 bg-muted/5 font-bold tracking-tight focus-visible:ring-primary',
                                errors.name &&
                                    'border-destructive bg-destructive/5 ring-1 ring-destructive',
                            )}
                        />
                        {errors.name && (
                            <div className="flex items-center gap-1.5 px-1 py-1 text-destructive">
                                <ShieldAlert size={10} />
                                <p className="text-[8px] font-black uppercase italic tracking-tighter">
                                    Error: {errors.name}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ---- SECTION: GEOLOCATION ---- */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
                                Loc_Street_Address
                            </Label>
                            <Input
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                className={cn(
                                    'h-11 rounded-none border-foreground/30 bg-transparent focus-visible:ring-primary',
                                    errors.address &&
                                        'border-destructive bg-destructive/5',
                                )}
                            />
                            {errors.address && (
                                <div className="flex items-center gap-1.5 px-1 py-1 text-destructive">
                                    <ShieldAlert size={10} />
                                    <p className="text-[8px] font-black uppercase italic tracking-tighter">
                                        Error: {errors.address}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
                                Loc_City_Node
                            </Label>
                            <Input
                                value={data.city}
                                onChange={(e) =>
                                    setData('city', e.target.value)
                                }
                                className={cn(
                                    'h-11 rounded-none border-foreground/30 bg-transparent focus-visible:ring-primary',
                                    errors.city &&
                                        'border-destructive bg-destructive/5',
                                )}
                            />
                            {errors.city && (
                                <div className="flex items-center gap-1.5 px-1 py-1 text-destructive">
                                    <ShieldAlert size={10} />
                                    <p className="text-[8px] font-black uppercase italic tracking-tighter">
                                        Error: {errors.city}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ---- SECTION: REGIONAL_CONFIG ---- */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
                                Region_Zone
                            </Label>
                            <Input
                                value={data.region}
                                onChange={(e) =>
                                    setData('region', e.target.value)
                                }
                                className={cn(
                                    'h-11 rounded-none border-foreground/30 bg-transparent text-[10px] font-bold uppercase tracking-widest focus-visible:ring-primary',
                                    errors.region &&
                                        'border-destructive bg-destructive/5',
                                )}
                            />
                            {errors.region && (
                                <div className="flex items-center gap-1.5 px-1 py-1 text-destructive">
                                    <ShieldAlert size={10} />
                                    <p className="text-[8px] font-black uppercase italic tracking-tighter">
                                        Error: {errors.region}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-center text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
                                PROVINCE
                            </Label>
                            <Input
                                value={data.province}
                                maxLength={2}
                                onChange={(e) =>
                                    setData(
                                        'province',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                className={cn(
                                    'h-11 rounded-none border-foreground/30 bg-transparent text-center font-mono text-[11px] font-black uppercase focus-visible:ring-primary',
                                    errors.province &&
                                        'border-destructive bg-destructive/5',
                                )}
                            />
                            {errors.province && (
                                <div className="flex items-center gap-1.5 px-1 py-1 text-destructive">
                                    <ShieldAlert size={10} />
                                    <p className="text-[8px] font-black uppercase italic tracking-tighter">
                                        Error: {errors.province}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-center text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
                                Zip_Code
                            </Label>
                            <Input
                                value={data.cap}
                                maxLength={5}
                                onChange={(e) => setData('cap', e.target.value)}
                                className={cn(
                                    'h-11 rounded-none border-foreground/30 bg-transparent text-center font-mono text-[11px] font-black focus-visible:ring-primary',
                                    errors.cap &&
                                        'border-destructive bg-destructive/5',
                                )}
                            />
                            {errors.cap && (
                                <div className="flex items-center gap-1.5 px-1 py-1 text-destructive">
                                    <ShieldAlert size={10} />
                                    <p className="text-[8px] font-black uppercase italic tracking-tighter">
                                        Error: {errors.cap}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
