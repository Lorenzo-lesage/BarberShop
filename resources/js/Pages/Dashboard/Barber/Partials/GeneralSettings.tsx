import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader2, Save } from 'lucide-react';

export function GeneralSettings({
    data,
    setData,
    errors,
    onSubmit,
    processing,
}: any) {
    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <header>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    01_Primary_Information
                </h3>
                <p className="mt-1 text-[9px] uppercase text-muted-foreground">
                    Global_Registry_Data
                </p>
            </header>

            <div className="grid gap-6">
                <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                        Salon_Name
                    </Label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={cn(
                            'h-11 rounded-none border-border/60 bg-transparent focus-visible:ring-primary',
                            errors.name && 'border-destructive',
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                            Physical_Address
                        </Label>
                        <Input
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="h-11 rounded-none border-border/60 bg-transparent"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                            City_Node
                        </Label>
                        <Input
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            className="h-11 rounded-none border-border/60 bg-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {/* Region - Occupa più spazio (2/4) */}
                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                            Region_Node
                        </Label>
                        <Input
                            value={data.region}
                            onChange={(e) => setData('region', e.target.value)}
                            className="h-11 rounded-none border-border/60 bg-transparent text-[10px] uppercase focus-visible:ring-primary"
                        />
                    </div>

                    {/* Prov (1/4) */}
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                            Prov
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
                            className="h-11 rounded-none border-border/60 bg-transparent text-center font-mono uppercase focus-visible:ring-primary"
                        />
                    </div>

                    {/* CAP (1/4) */}
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">
                            Zip_Code
                        </Label>
                        <Input
                            value={data.cap}
                            maxLength={5}
                            onChange={(e) => setData('cap', e.target.value)}
                            className="h-11 rounded-none border-border/60 bg-transparent text-center font-mono focus-visible:ring-primary"
                        />
                    </div>
                </div>
            </div>

            <Button
                disabled={processing}
                className="h-12 w-full rounded-none bg-primary px-10 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-primary/90 md:w-auto"
            >
                {processing ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" /> Commit_Changes
                    </>
                )}
            </Button>
        </form>
    );
}
