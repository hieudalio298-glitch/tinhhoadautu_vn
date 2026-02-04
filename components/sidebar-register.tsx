'use client'

import { Button } from "@/components/ui/button"
import { Star, ShieldCheck, ArrowRight } from "lucide-react"
import Link from 'next/link'

export function SidebarRegister() {
    return (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-6 text-white shadow-xl shadow-indigo-200 border border-slate-800 relative overflow-hidden group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <Star className="h-5 w-5 text-primary fill-current" />
                    </div>
                    <h3 className="font-bold text-lg tracking-tight">Gói Hội Viên VIP</h3>
                </div>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                    Mở khóa các <span className="text-white font-semibold">Khuyến nghị đặc biệt</span> và báo cáo phân tích báo cáo doanh nghiệp hàng tuần.
                </p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span>Xem nội dung giới hạn</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span>Tín hiệu mua/bán sớm</span>
                    </div>
                </div>

                <Button
                    asChild
                    className="w-full font-bold h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 group"
                >
                    <Link href="/pricing" className="flex items-center justify-center gap-2">
                        Nâng cấp ngay
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>

                <p className="text-[10px] text-slate-500 mt-4 text-center">
                    Bắt đầu đầu tư chuyên nghiệp từ <span className="text-slate-300">199.000đ/tháng</span>
                </p>
            </div>
        </div>
    )
}
