'use client';

import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// Components
import { Card, CardContent } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
    value: {
        label: 'Appointments',
        color: 'hsl(var(--primary))',
    },
} satisfies ChartConfig;

interface PerformanceChartProps {
    data: { label: string; value: number }[];
    activeFilter: string;
}

export function PerformanceChart({
    data,
    activeFilter,
}: PerformanceChartProps) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const maxVal = Math.max(...data.map((d) => d.value), 1);

    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    /**
     * Handle filter change
     * @param filter
     */
    const handleFilterChange = (filter: string) => {
        router.get(
            route('dashboard'),
            { filter: filter },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['chartData', 'activeFilter', 'flash'],
            },
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */


    return (
        <Card className="rounded-none border-x-0 border-b border-t-0 border-border/60 bg-muted/5 shadow-none">
            <div className="flex items-center justify-between px-6 pt-6">
                <div className="space-y-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/70">
                        Performance_Stream
                    </h2>
                    <p className="font-mono text-[8px] font-bold uppercase italic text-primary">
                        Status: Active_Nodes / {activeFilter}
                    </p>
                </div>

                {/* Filtri stile "Console" */}
                <div className="flex border border-border/60 bg-background/50 p-1">
                    {[
                        { id: '7d', label: '7_D' },
                        { id: '30d', label: '30_D' },
                        { id: '90d', label: '90_D' },
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => handleFilterChange(f.id)}
                            className={cn(
                                'min-w-[40px] px-2 py-1 text-[8px] font-black tracking-widest transition-all',
                                activeFilter?.toLowerCase() ===
                                    f.id.toLowerCase()
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-primary/10',
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <CardContent className="px-2 pb-6 pt-4 sm:px-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[220px] w-full"
                >
                    <AreaChart data={data} margin={{ left: -20, right: 10 }}>
                        {data.length > 0 ? (
                            <>
                                <defs>
                                    {/* Gradiente Area */}
                                    <linearGradient
                                        id="fillValue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-value)"
                                            stopOpacity={0.2}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-value)"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    vertical={false}
                                    stroke="currentColor"
                                    className="text-border/20"
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={12}
                                    minTickGap={32}
                                    tick={{
                                        fontSize: 9,
                                        fontFamily: 'monospace',
                                        fill: 'currentColor',
                                        opacity: 0.4,
                                    }}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    allowDecimals={false}
                                    // Se il max è piccolo (es. 2) mostriamo 0,1,2. Se è grande (es. 50) lasciamo fare a Recharts
                                    domain={[
                                        0,
                                        maxVal > 5 ? 'auto' : maxVal + 1,
                                    ]}
                                    tick={{
                                        fontSize: 9,
                                        fontFamily: 'monospace',
                                        fill: 'currentColor',
                                        opacity: 0.4,
                                    }}
                                />

                                <ChartTooltip
                                    cursor={{
                                        stroke: 'hsl(var(--primary))',
                                        strokeWidth: 0.5,
                                        strokeDasharray: '4 4',
                                    }}
                                    content={
                                        <ChartTooltipContent
                                            indicator="line"
                                            className="rounded-none border-primary/20 bg-background/95 font-mono text-[9px] uppercase backdrop-blur-md"
                                        />
                                    }
                                />

                                <Area
                                    dataKey="value"
                                    type="monotone"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    fill="url(#fillValue)"
                                    connectNulls={true}
                                    animationDuration={1500}
                                    style={{
                                        filter: 'drop-shadow(0px 0px 4px hsl(var(--primary) / 0.4))',
                                    }}
                                    // Pallino sul punto attivo
                                    activeDot={{
                                        r: 4,
                                        fill: 'hsl(var(--primary))',
                                        strokeWidth: 0,
                                        filter: 'drop-shadow(0px 0px 8px hsl(var(--primary)))',
                                    }}
                                />
                            </>
                        ) : (
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="currentColor"
                                opacity={0.4}
                            >
                                No data
                            </text>
                        )}
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
