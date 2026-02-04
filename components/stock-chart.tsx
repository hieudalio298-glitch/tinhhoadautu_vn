
'use client'

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StockChartProps {
    data: {
        price: number
        fetched_at: string
    }[]
    symbol: string
}

export function StockChart({ data, symbol }: StockChartProps) {
    // Format data for chart
    const chartData = data.map(item => ({
        time: new Date(item.fetched_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        date: new Date(item.fetched_at).toLocaleDateString('vi-VN'),
        originalDate: new Date(item.fetched_at),
        price: item.price
    })).sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Biểu đồ giá: {symbol}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="time"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(value)}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: any) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 'Giá']}
                                labelFormatter={(label) => `Thời gian: ${label}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#2563eb"
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
