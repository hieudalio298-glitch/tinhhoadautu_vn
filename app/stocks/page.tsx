
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"

export default async function StocksListPage() {
    const supabase = await createClient()
    const { data: stocks } = await supabase.from('stock_symbols').select('*').order('symbol')

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Danh sách Mã Cổ Phiếu</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {stocks?.map((stock) => (
                    <Link key={stock.id} href={`/stocks/${stock.symbol}`}>
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card text-center h-full flex flex-col justify-center items-center">
                            <h3 className="text-xl font-bold text-primary mb-1">{stock.symbol}</h3>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{stock.company_name}</p>
                            <Badge variant="secondary" className="text-[10px]">{stock.market}</Badge>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
