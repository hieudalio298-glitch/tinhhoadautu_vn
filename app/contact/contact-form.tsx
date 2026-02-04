'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, MessageSquare, Loader2, CheckCircle2 } from "lucide-react"
import { submitContactForm } from './actions'

export function ContactForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        setLoading(true)
        setError(null)

        const formData = new FormData(form)
        const result = await submitContactForm(formData)

        if (result.success) {
            setSuccess(true)
            form.reset()
        } else {
            setError(result.error || 'Đã có lỗi xảy ra.')
        }
        setLoading(false)
    }

    if (success) {
        return (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border text-center space-y-6 flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold">Gửi phản hồi thành công!</h2>
                <p className="text-muted-foreground">Cảm ơn bạn đã quan tâm. Chúng tôi sẽ sớm liên hệ lại với bạn qua các thông tin đã cung cấp.</p>
                <Button onClick={() => setSuccess(false)} variant="outline">Gửi thêm phản hồi khác</Button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input id="name" name="name" required placeholder="Nguyễn Văn A" className="h-12 bg-slate-50 border-transparent focus:bg-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" name="phone" placeholder="0901 xxx xxx" className="h-12 bg-slate-50 border-transparent focus:bg-white" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" type="email" required placeholder="email@example.com" className="h-12 bg-slate-50 border-transparent focus:bg-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Chủ đề</Label>
                    <Input id="subject" name="subject" placeholder="Hợp tác, hỗ trợ kỹ thuật..." className="h-12 bg-slate-50 border-transparent focus:bg-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Nội dung</Label>
                    <Textarea id="message" name="message" required rows={5} placeholder="Nhập lời nhắn của bạn tại đây..." className="bg-slate-50 border-transparent focus:bg-white" />
                </div>
                <Button disabled={loading} className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 flex gap-2 active:scale-95 transition-transform">
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Đang gửi...
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5" /> Gửi phản hồi ngay
                        </>
                    )}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1 mt-4 italic">
                    <MessageSquare className="h-3 w-3" /> Thông tin của bạn được bảo mật tuyệt đối.
                </p>
            </form>
        </div>
    )
}
