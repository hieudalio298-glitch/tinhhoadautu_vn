
'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Facebook, Youtube, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function Hero() {
    const [socialUrls, setSocialUrls] = useState({
        facebook: 'https://facebook.com',
        youtube: 'https://youtube.com',
        twitter: 'https://twitter.com'
    })

    useEffect(() => {
        const supabase = createClient()
        async function fetchSocialSettings() {
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', ['facebook_url', 'youtube_url', 'twitter_url'])

            if (data) {
                const urls = { ...socialUrls }
                data.forEach(item => {
                    let val = item.value
                    try { val = JSON.parse(val) } catch (e) { }
                    if (item.key === 'facebook_url') urls.facebook = val || urls.facebook
                    if (item.key === 'youtube_url') urls.youtube = val || urls.youtube
                    if (item.key === 'twitter_url') urls.twitter = val || urls.twitter
                })
                setSocialUrls(urls)
            }
        }
        fetchSocialSettings()
    }, [])

    return (
        <section className="relative overflow-hidden bg-white py-24 lg:py-32">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 border border-primary/20"
                    >
                        <TrendingUp className="h-3 w-3" />
                        Nền tảng tri thức tài chính hàng đầu
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
                    >
                        Thấu hiểu thị trường <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
                            chứng khoán
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex items-center justify-center gap-6 mb-12"
                    >
                        {[
                            {
                                icon: Facebook,
                                color: 'hover:bg-blue-600',
                                shadow: 'hover:shadow-blue-500/40',
                                url: socialUrls.facebook
                            },
                            {
                                icon: Youtube,
                                color: 'hover:bg-red-600',
                                shadow: 'hover:shadow-red-500/40',
                                url: socialUrls.youtube
                            },
                            {
                                icon: Twitter,
                                color: 'hover:bg-slate-900',
                                shadow: 'hover:shadow-slate-900/40',
                                url: socialUrls.twitter
                            }
                        ].map((social, i) => (
                            <motion.a
                                key={i}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{
                                    scale: 1.15,
                                    rotateY: 20,
                                    rotateX: -10,
                                    y: -8
                                }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-slate-400 ${social.color} hover:text-white transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.05),0_6px_6px_rgba(0,0,0,0.05)] ${social.shadow} hover:shadow-[0_20px_30px_-5px_red] border border-slate-100 group relative overflow-hidden`}
                                style={{ perspective: '1000px' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <social.icon className="h-5 w-5 md:h-7 md:w-7 relative z-10" />
                                {/* 3D "Shadow" underlying effect */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 group-hover:bg-white/20" />
                            </motion.a>
                        ))}
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Cập nhật tin tức, phân tích chuyên sâu và nhận định từ các chuyên gia.
                        Đầu tư thông minh và bền vững hơn cùng cộng đồng <span className="text-foreground font-semibold italic">Tinh Hoa Đầu Tư</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
                    >
                        <Button asChild size="lg" className="h-14 px-8 text-md font-bold shadow-xl shadow-primary/20 rounded-full group">
                            <Link href="/blog" className="flex items-center gap-2">
                                Đọc bài viết mới nhất
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild className="h-14 px-8 text-md font-bold rounded-full border-2 hover:bg-muted/50">
                            <Link href="/stocks">Xem bảng giá thị trường</Link>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Floating Decorative Mesh/Lines (SVG) */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] -translate-y-1/2 opacity-[0.03] -z-10 select-none pointer-events-none">
                <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M0,500 Q250,400 500,500 T1000,500" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M0,600 Q250,500 500,600 T1000,600" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M0,400 Q250,300 500,400 T1000,400" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>
        </section>
    )
}

