'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

interface TrafficChartProps {
    data: { created_at: string }[]
}

export default function TrafficChart({ data }: TrafficChartProps) {
    // Group by date
    const dailyCounts: { [key: string]: number } = {}

    data.forEach(item => {
        const date = new Date(item.created_at).toLocaleDateString('vi-VN')
        dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    const chartData = Object.entries(dailyCounts).map(([date, count]) => ({
        date,
        views: count
    }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lưu lượng truy cập 30 ngày qua</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelFormatter={(label) => `Ngày: ${label}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ fill: '#2563eb' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
