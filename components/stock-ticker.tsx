
'use client'

import { createClient } from '@/utils/supabase/client'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function StockTicker() {
    const [uniquePrices, setUniquePrices] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        async function fetchPrices() {
            const { data: prices } = await supabase
                .from('stock_prices')
                .select('symbol, price, change')
                .order('fetched_at', { ascending: false })
                .limit(20)

            if (prices) {
                // Deduplicate symbols
                const unique = Array.from(new Map(prices.map(item => [item.symbol, item])).values())
                setUniquePrices(unique)
            }
        }
        fetchPrices()
    }, [])

    if (uniquePrices.length === 0) return null

    // Duplicate list for infinite scroll effect
    const tickerItems = [...uniquePrices, ...uniquePrices, ...uniquePrices]

    return (
        <div className="bg-slate-900 text-white overflow-hidden py-3 border-b border-white/5 relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10" />

            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="flex items-center gap-12 whitespace-nowrap pl-8"
            >
                {tickerItems.map((stock, idx) => (
                    <div key={`${stock.symbol}-${idx}`} className="flex items-center gap-3 group cursor-default">
                        <span className="font-black tracking-tighter text-slate-400 group-hover:text-white transition-colors uppercase">{stock.symbol}</span>
                        <span className="font-mono font-bold">
                            {new Intl.NumberFormat('vi-VN').format(stock.price)}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${stock.change > 0 ? "bg-green-500/20 text-green-400" : stock.change < 0 ? "bg-red-500/20 text-red-400" : "bg-slate-500/20 text-slate-400"}`}>
                            {stock.change > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : stock.change < 0 ? <ArrowDown className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                            {Math.abs(stock.change)}%
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

