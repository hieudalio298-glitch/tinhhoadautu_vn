import Link from 'next/link'
import { Facebook, Youtube, Twitter } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

async function getSetting(supabase: any, key: string, defaultValue: string) {
    const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single()
    if (!data?.value) return defaultValue
    try { return JSON.parse(data.value) } catch { return data.value }
}

export async function Footer() {
    const supabase = await createClient()
    const fbUrl = await getSetting(supabase, 'facebook_url', 'https://facebook.com')
    const ytUrl = await getSetting(supabase, 'youtube_url', 'https://youtube.com')
    const twUrl = await getSetting(supabase, 'twitter_url', 'https://twitter.com')

    return (
        <footer className="border-t bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <Link href="/" className="block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/logo.png"
                                alt="Tinh Hoa Đầu Tư Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Nền tảng tri thức chứng khoán chuyên sâu, cung cấp nhận định thị trường và phân tích cổ phiếu theo thời gian thực.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all duration-300">
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a href={twUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Liên kết</h3>
                        <ul className="space-y-4 text-sm text-slate-500 font-bold">
                            <li><Link href="/about" className="hover:text-primary transition-colors">Về chúng tôi</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Liên hệ đối tác</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Điều khoản dịch vụ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Danh mục</h3>
                        <ul className="space-y-4 text-sm text-slate-500 font-bold">
                            <li><Link href="/blog?category=tin-tuc" className="hover:text-primary transition-colors">Tin tức thị trường</Link></li>
                            <li><Link href="/blog?category=phan-tich-co-phieu" className="hover:text-primary transition-colors">Phân tích kỹ thuật</Link></li>
                            <li><Link href="/blog?category=phan-tich-vi-mo" className="hover:text-primary transition-colors">Kinh tế vĩ mô</Link></li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="font-black text-slate-900 mb-4 text-sm">Newsletter</h3>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Nhận bản tin phân tích hàng tuần qua Email.</p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="w-full px-4 py-3 text-xs rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20"
                            />
                            <button className="w-full py-3 text-xs font-black bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all duration-300">
                                ĐĂNG KÝ NGAY
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div>© 2026 Tinh Hoa Đầu Tư. All rights reserved.</div>
                    <div className="flex gap-6">
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

