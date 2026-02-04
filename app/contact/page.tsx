
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"
import { createClient } from '@/utils/supabase/server'
import { ContactForm } from "./contact-form"

async function getSetting(supabase: any, key: string) {
    const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single()

    if (!data?.value) return null

    try {
        return JSON.parse(data.value)
    } catch {
        return data.value
    }
}

export default async function ContactPage() {
    const supabase = await createClient()
    const email = await getSetting(supabase, 'contact_email') || 'contact@stockblog.vn'
    const phone = await getSetting(supabase, 'contact_phone') || '09xx.xxx.xxx'
    const address = await getSetting(supabase, 'contact_address') || 'Tòa nhà Landmark 81, Quận Bình Thạnh, TP. HCM'

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 italic">
                            Kết nối với <span className="text-primary italic">chúng tôi</span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Chúng tôi luôn sẵn lòng lắng nghe ý kiến đóng góp và giải đáp mọi thắc mắc của bạn về thị trường chứng khoán.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Email hỗ trợ</h3>
                                <p className="text-muted-foreground">{email}</p>
                                <p className="text-xs text-primary font-medium mt-1">Phản hồi trong vòng 24h</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Hotline / Zalo</h3>
                                <p className="text-muted-foreground">{phone}</p>
                                <p className="text-xs text-green-600 font-medium mt-1">Làm việc 8:00 - 21:00</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Địa chỉ văn phòng</h3>
                                <p className="text-muted-foreground">{address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t flex items-center gap-6">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Follow Us</span>
                        <div className="flex gap-4">
                            {['FB', 'YT', 'TK'].map(social => (
                                <div key={social} className="w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold hover:bg-slate-900 hover:text-white transition-all cursor-pointer bg-white shadow-sm">
                                    {social}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <ContactForm />
            </div>
        </div>
    )
}
