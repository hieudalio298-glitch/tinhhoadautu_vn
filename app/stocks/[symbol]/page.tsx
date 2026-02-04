
import { createClient } from '@/utils/supabase/server'
import { StockChart } from '@/components/stock-chart'
import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus, Building2 } from "lucide-react"

type Params = Promise<{ symbol: string }>

export default async function StockPage({ params }: { params: Params }) {
    const { symbol } = await params
    const supabase = await createClient()

    // Fetch symbol info
    const { data: stockInfo } = await supabase
        .from('stock_symbols')
        .select('*')
        .eq('symbol', symbol.toUpperCase())
        .single()

    if (!stockInfo) {
        notFound()
    }

    // Fetch price history
    const { data: prices } = await supabase
        .from('stock_prices')
        .select('price, fetched_at, change')
        .eq('symbol', symbol.toUpperCase())
        .order('fetched_at', { ascending: false })
        .limit(50) // Get last 50 data points for chart

    const currentPrice = prices?.[0]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold">{stockInfo.symbol}</h1>
                                <Badge variant="outline" className="text-lg py-1">{stockInfo.market}</Badge>
                            </div>
                            <h2 className="text-xl text-muted-foreground">{stockInfo.company_name}</h2>
                        </div>

                        {currentPrice && (
                            <div className="text-right">
                                <div className="text-3xl font-bold text-primary">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice.price)}
                                </div>
                                <div className={`flex items-center justify-end gap-1 font-medium ${currentPrice.change > 0 ? "text-green-600" : currentPrice.change < 0 ? "text-red-600" : "text-gray-600"}`}>
                                    {currentPrice.change > 0 ? <ArrowUp className="h-4 w-4" /> : currentPrice.change < 0 ? <ArrowDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                                    {Math.abs(currentPrice.change)}%
                                </div>
                            </div>
                        )}
                    </div>

                    <StockChart data={prices || []} symbol={stockInfo.symbol} />

                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Thông tin doanh nghiệp
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Mã cổ phiếu</span>
                                <span className="font-medium">{stockInfo.symbol}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Sàn niêm yết</span>
                                <span className="font-medium">{stockInfo.market}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Ngành nghề</span>
                                <span className="font-medium">{stockInfo.sector}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Tên công ty</span>
                                <span className="font-medium">{stockInfo.company_name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar placeholder for Related News */}
                <aside className="w-full md:w-80 space-y-6">
                    <div className="bg-muted/30 rounded-lg p-6">
                        <h3 className="font-bold mb-4">Tin tức liên quan</h3>
                        <p className="text-sm text-muted-foreground">Chức năng đang phát triển...</p>
                    </div>
                </aside>
            </div>
        </div>
    )
}
