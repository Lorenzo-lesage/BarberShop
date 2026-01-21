export function SaloonSkeleton() {
    return (
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/20 p-6">
            {/* Animazione di scansione (Luce che passa) */}
            <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-muted/10 via-muted/30 to-muted/10" />

            <div className="relative z-10 flex h-full flex-col justify-between">
                {/* Top Badge Skeleton */}
                <div className="h-4 w-16 bg-muted/40" />

                {/* Bottom Content Skeleton */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        {/* Title Line 1 */}
                        <div className="h-8 w-3/4 bg-muted/60" />
                        {/* Subtitle Line */}
                        <div className="h-3 w-1/2 bg-muted/30" />
                    </div>

                    {/* Divider Line */}
                    <div className="h-[1px] w-8 bg-muted/20" />

                    <div className="space-y-3">
                        {/* Info Line */}
                        <div className="h-2 w-full bg-muted/20" />
                        {/* Button Skeleton */}
                        <div className="h-12 w-full border border-muted/30 bg-muted/10" />
                    </div>
                </div>
            </div>

            {/* Corner Accent Skeleton */}
            <div className="absolute bottom-0 right-0 h-1 w-1 bg-muted/40" />
        </div>
    );
}
