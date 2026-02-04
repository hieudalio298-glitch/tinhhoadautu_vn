'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, ShieldCheck, Zap, CreditCard, Copy, X as CloseIcon } from "lucide-react"
import { requestUpgrade } from './actions'

const plans = [
    // ... (plans stay the same)
    {
        name: "Cơ bản",
        price: "Miễn phí",
        description: "Dành cho nhà đầu tư mới bắt đầu",
        features: [
            "Đọc tin tức thị trường",
            "Phân tích cổ phiếu cơ bản",
            "Bình luận bài viết",
            "Xem bảng giá thời gian thực"
        ],
        buttonText: "Đang sử dụng",
        planType: "free",
        popular: false
    },
    {
        name: "Hội viên PRO",
        price: "199.000đ",
        period: "/tháng",
        description: "Phù hợp cho nhà đầu tư cá nhân",
        features: [
            "Tất cả quyền lợi gói Cơ bản",
            "Xem mục Khuyến nghị đặc biệt",
            "Báo cáo phân tích vĩ mô hàng tuần",
            "Tín hiệu mua/bán cổ phiếu",
            "Hỗ trợ qua Zalo/Email"
        ],
        buttonText: "Nâng cấp ngay",
        planType: "pro",
        popular: true
    },
    {
        name: "Premium VIP",
        price: "499.000đ",
        period: "/tháng",
        description: "Dành cho nhà đầu tư chuyên nghiệp",
        features: [
            "Tất cả quyền lợi gói PRO",
            "Danh mục đầu tư độc quyền",
            "Phân tích theo yêu cầu riêng",
            "Tham gia nhóm chat VIP",
            "Gặp gỡ chuyên gia định kỳ"
        ],
        buttonText: "Nâng cấp Premium",
        planType: "premium",
        popular: false
    }
]

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
    const [showPayment, setShowPayment] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [paymentInfo, setPaymentInfo] = useState({
        bankName: 'MB BANK',
        accountNumber: '1903456789012',
        accountName: 'NGUYEN VAN A'
    })

    const supabase = createClient()

    useEffect(() => {
        async function fetchPaymentSettings() {
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', ['bank_name', 'bank_account_number', 'bank_account_name'])

            if (data) {
                const info = { ...paymentInfo }
                data.forEach(item => {
                    const val = JSON.parse(item.value)
                    if (item.key === 'bank_name' && val) info.bankName = val
                    if (item.key === 'bank_account_number' && val) info.accountNumber = val
                    if (item.key === 'bank_account_name' && val) info.accountName = val
                })
                setPaymentInfo(info)
            }
        }
        fetchPaymentSettings()
    }, [])

    const handlePlanSelect = (plan: any) => {
        if (plan.planType === 'free') return
        setSelectedPlan(plan)
        setShowPayment(true)
    }

    const confirmPayment = async () => {
        if (!selectedPlan) return

        setLoading(selectedPlan.planType)
        setMessage(null)

        const result = await requestUpgrade(selectedPlan.planType)

        if (result.error) {
            setMessage({ type: 'error', text: result.error })
        } else {
            setMessage({ type: 'success', text: 'Yêu cầu nâng cấp của bạn đã được gửi! Chúng tôi sẽ kiểm tra và phê duyệt trong vòng 5-10 phút.' })
        }
        setLoading(null)
        setShowPayment(false)
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                    Nâng tầm trải nghiệm <span className="text-primary italic">đầu tư</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    Chọn gói hội viên phù hợp để nhận được những phân tích độc quyền và tín hiệu thị trường chính xác nhất từ đội ngũ của StockBlog.
                </p>
            </div>

            {message && (
                <div className={`mb-10 p-4 rounded-lg border text-center max-w-2xl mx-auto ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`relative flex flex-col h-full transition-all hover:scale-[1.02] duration-300 ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10' : 'border-border'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current" /> PHỔ BIẾN NHẤT
                            </div>
                        )}

                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">{plan.period}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-grow">
                            <ul className="space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm">
                                        <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter>
                            <Button
                                className={`w-full font-bold h-12 ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-muted/80'
                                    }`}
                                variant={plan.popular ? 'default' : 'outline'}
                                disabled={plan.planType === 'free'}
                                onClick={() => handlePlanSelect(plan)}
                            >
                                {plan.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Payment Modal */}
            {showPayment && selectedPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border">
                        <div className="bg-primary p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Thông tin thanh toán</h3>
                                <p className="text-primary-foreground/80 text-sm">Đang nâng cấp gói: {selectedPlan.name}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowPayment(false)} className="text-white hover:bg-white/20">
                                <CloseIcon className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                                {/* Bank Info */}
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Ngân hàng</Label>
                                        <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
                                            <span className="font-bold text-sm uppercase">{paymentInfo.bankName}</span>
                                            <Copy className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-primary" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Số tài khoản</Label>
                                        <div className="flex items-center justify-between bg-muted/50 p-2 rounded border border-primary/10">
                                            <span className="font-bold text-sm select-all">{paymentInfo.accountNumber}</span>
                                            <Copy className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-primary" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Chủ tài khoản</Label>
                                        <div className="flex items-center justify-between bg-muted/50 p-1 rounded">
                                            <span className="font-bold text-xs uppercase text-muted-foreground">{paymentInfo.accountName}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Số tiền</Label>
                                        <div className="font-bold text-xl text-primary">{selectedPlan.price}</div>
                                    </div>
                                    <div className="space-y-1 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                        <Label className="text-yellow-700 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                                            <CreditCard className="h-3 w-3" /> Nội dung chuyển khoản
                                        </Label>
                                        <div className="font-mono text-xs font-bold text-yellow-900 break-all bg-white/50 p-1 mt-1 uppercase">
                                            STOCKBLOG {selectedPlan.planType.toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code Placeholder */}
                                <div className="text-center space-y-2">
                                    <div className="aspect-square bg-white border p-2 rounded-xl shadow-inner relative overflow-hidden group">
                                        <img
                                            src={`https://img.vietqr.io/image/${paymentInfo.bankName.replace(/\s+/g, '')}-${paymentInfo.accountNumber}-compact.png?amount=${selectedPlan.price.replace(/\D/g, '')}&addInfo=STOCKBLOG%20${selectedPlan.planType.toUpperCase()}&accountName=${encodeURIComponent(paymentInfo.accountName)}`}
                                            alt="Mã QR Thanh toán"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic">Quét mã bằng App Ngân hàng</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <Button
                                    className="w-full h-12 font-bold text-lg shadow-lg active:scale-95 transition-transform"
                                    onClick={confirmPayment}
                                    disabled={loading === selectedPlan.planType}
                                >
                                    {loading === selectedPlan.planType ? 'Đang gửi...' : 'Tôi đã thanh toán'}
                                </Button>
                                <p className="text-[11px] text-center text-muted-foreground">
                                    Bằng cách bấm nút trên, yêu cầu của bạn sẽ được gửi tới chúng tôi.
                                    Vui lòng đảm bảo bạn đã thực hiện chuyển tiền thành công.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-center border-t pt-16">
                <div>
                    <div className="flex justify-center mb-4">
                        <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">Tín hiệu nhanh chóng</h4>
                    <p className="text-sm text-muted-foreground">Nhận thông báo Real-time về các biến động và cơ hội ngay lập tức.</p>
                </div>
                <div>
                    <div className="flex justify-center mb-4">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">Thông tin bảo mật</h4>
                    <p className="text-sm text-muted-foreground">Các khuyến nghị độc quyền chỉ dành cho thành viên Premium.</p>
                </div>
                <div>
                    <div className="flex justify-center mb-4">
                        <Star className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">Đội ngũ chuyên gia</h4>
                    <p className="text-sm text-muted-foreground">Được đồng hành bởi các chuyên gia chứng khoán giàu kinh nghiệm.</p>
                </div>
            </div>
        </div>
    )
}

