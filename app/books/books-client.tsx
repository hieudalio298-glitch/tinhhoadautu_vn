
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Download, ShoppingCart, BookOpen, User, Copy, CreditCard, X as CloseIcon } from "lucide-react"
import { createBookOrder } from './actions'

export default function BooksClient({ initialBooks }: { initialBooks: any[] }) {
    const [selectedBook, setSelectedBook] = useState<any | null>(null)
    const [showPayment, setShowPayment] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [paymentInfo, setPaymentInfo] = useState({
        bankName: 'MB BANK',
        accountNumber: '1903456789012',
        accountName: 'NGUYEN VAN A'
    })
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        phone: '',
        address: '',
        email: ''
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

    const handleBuyClick = (book: any) => {
        setSelectedBook(book)
        setShowPayment(true)
    }

    const confirmPayment = async () => {
        if (!selectedBook) return

        // Basic validation
        if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.email) {
            alert('Vui lòng điền đầy đủ thông tin nhận hàng trước khi xác nhận thanh toán.');
            return;
        }

        setLoading(true)
        setMessage(null)

        const result = await createBookOrder(
            selectedBook.id,
            selectedBook.price,
            shippingInfo.name,
            shippingInfo.phone,
            shippingInfo.address,
            shippingInfo.email
        )

        if (result.error) {
            setMessage({ type: 'error', text: result.error })
        } else {
            setMessage({ type: 'success', text: `Yêu cầu mua sách "${selectedBook.title}" đã được gửi! Chúng tôi sẽ liên hệ sớm nhất.` })
            setShowPayment(false)
            // Clear shipping info
            setShippingInfo({ name: '', phone: '', address: '', email: '' })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        setLoading(false)
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Thư viện <span className="text-primary italic">Sách hay</span></h1>
                <p className="text-muted-foreground text-lg">
                    Tổng hợp những đầu sách tinh hoa về chứng khoán, tài chính và tư duy đầu tư.
                    Tặng kèm bản PDF miễn phí cho các đầu sách kinh điển.
                </p>
            </div>

            {message && (
                <div className={`mb-10 p-4 rounded-lg border text-center max-w-2xl mx-auto ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {initialBooks && initialBooks.length > 0 ? (
                    initialBooks.map((book) => (
                        <Card key={book.id} className="group flex flex-col h-full hover:shadow-xl transition-all duration-300 border-none bg-muted/30 overflow-hidden">
                            <div className="aspect-[3/4] overflow-hidden relative bg-muted">
                                {book.cover_image ? (
                                    <img
                                        src={book.cover_image}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                                        <BookOpen className="h-12 w-12 opacity-20" />
                                        <span className="text-xs italic">Chưa có ảnh bìa</span>
                                    </div>
                                )}

                                {book.is_free && (
                                    <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600 border-none shadow-lg">
                                        PDF Miễn phí
                                    </Badge>
                                )}
                            </div>

                            <CardHeader className="p-5 pb-2">
                                <div className="flex items-center gap-1 text-[10px] text-primary font-bold uppercase tracking-wider mb-2">
                                    <User className="h-3 w-3" />
                                    {book.author || 'Tác giả Ẩn danh'}
                                </div>
                                <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                                    {book.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-5 pt-0 flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                    {book.description || "Chưa có mô tả cho quyển sách này."}
                                </p>
                            </CardContent>

                            <CardFooter className="p-5 pt-0 flex flex-col gap-3">
                                <div className="flex items-center justify-between w-full mb-2">
                                    <span className="text-xl font-black text-slate-900">
                                        {book.price > 0 ? new Intl.NumberFormat('vi-VN').format(book.price) + 'đ' : '0đ'}
                                    </span>
                                </div>

                                {book.is_free ? (
                                    <Button asChild className="w-full bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-100" size="lg">
                                        <a href={book.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                            <Download className="h-4 w-4" /> Tải PDF Ngay
                                        </a>
                                    </Button>
                                ) : (
                                    <Button onClick={() => handleBuyClick(book)} className="w-full shadow-lg shadow-primary/20 font-bold" size="lg">
                                        <ShoppingCart className="h-4 w-4 mr-2" /> Mua sách giấy
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                        <BookOpen className="h-16 w-16 mx-auto text-muted mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">Thư viện đang được cập nhật...</h3>
                        <p className="text-muted-foreground">Các đầu sách tinh hoa sẽ sớm xuất hiện tại đây.</p>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPayment && selectedBook && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border flex flex-col">
                        <div className="bg-primary p-6 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-xl font-bold">Thanh toán & Địa chỉ giao hàng</h3>
                                <p className="text-primary-foreground/80 text-sm italic">{selectedBook.title}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowPayment(false)} className="text-white hover:bg-white/20">
                                <CloseIcon className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Shipping Form */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <h4 className="font-bold text-lg">Thông tin người nhận</h4>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cust_name">Họ và tên *</Label>
                                            <Input
                                                id="cust_name"
                                                required
                                                value={shippingInfo.name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                                placeholder="Nguyễn Văn A"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cust_phone">Số điện thoại *</Label>
                                            <Input
                                                id="cust_phone"
                                                required
                                                value={shippingInfo.phone}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                                placeholder="0901 xxx xxx"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cust_email">Email nhận thông báo *</Label>
                                        <Input
                                            id="cust_email"
                                            type="email"
                                            required
                                            value={shippingInfo.email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cust_address">Địa chỉ nhận sách chi tiết *</Label>
                                        <Textarea
                                            id="cust_address"
                                            required
                                            rows={3}
                                            value={shippingInfo.address}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                                        />
                                    </div>

                                    <p className="text-[10px] text-muted-foreground italic">
                                        * Vui lòng điền đúng thông tin để chúng tôi có thể giao sách đến đúng địa chỉ của bạn.
                                    </p>
                                </div>

                                {/* Bank Info & QR */}
                                <div className="space-y-6 lg:border-l lg:pl-12">
                                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <h4 className="font-bold text-lg">Thông tin thanh toán</h4>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 items-start">
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
                                                <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Số tiền</Label>
                                                <div className="font-bold text-2xl text-primary">{new Intl.NumberFormat('vi-VN').format(selectedBook.price)}đ</div>
                                            </div>
                                            <div className="space-y-1 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                                                <Label className="text-yellow-700 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                                                    Nội dung chuyển khoản
                                                </Label>
                                                <div className="font-mono text-xs font-bold text-yellow-900 break-all uppercase">
                                                    SACH {selectedBook.id.slice(0, 8).toUpperCase()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center space-y-2">
                                            <div className="mx-auto w-48 aspect-square bg-white border p-1 rounded-xl shadow-inner relative overflow-hidden">
                                                <img
                                                    src={`https://img.vietqr.io/image/${paymentInfo.bankName.replace(/\s+/g, '')}-${paymentInfo.accountNumber}-compact.png?amount=${selectedBook.price}&addInfo=SACH%20${selectedBook.id.slice(0, 8).toUpperCase()}&accountName=${encodeURIComponent(paymentInfo.accountName)}`}
                                                    alt="Mã QR"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground italic">Quét bằng App Ngân hàng</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-muted/20 border-t shrink-0">
                            <Button
                                className="w-full h-14 text-xl font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                                onClick={confirmPayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Đang gửi yêu cầu...
                                    </div>
                                ) : 'Xác nhận & Tôi đã thanh toán'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
