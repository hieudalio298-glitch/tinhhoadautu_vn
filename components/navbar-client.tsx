'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { motion } from 'framer-motion'
import React from 'react'

interface NavbarClientProps {
    authButton: React.ReactNode
}

export function NavbarClient({ authButton }: NavbarClientProps) {
    return (
        <nav className="sticky top-4 z-50 px-4 mb-4 mt-2">
            <div className="container mx-auto">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="h-20 bg-stone-50/90 backdrop-blur-xl border border-stone-200/50 rounded-[32px] flex items-center justify-between px-8 shadow-[0_20px_40px_rgba(0,0,0,0.08),0_10px_15px_rgba(0,0,0,0.05)] relative overflow-hidden"
                >
                    {/* Soft Light Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

                    <Link href="/" className="relative z-10 flex items-center group transition-transform hover:scale-105 active:scale-95">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/logo.png"
                            alt="Tinh Hoa Đầu Tư Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 relative z-10">
                        {[
                            { name: 'Trang chủ', href: '/' },
                            { name: 'Bài viết', href: '/blog' },
                            { name: 'Sách hay', href: '/books' },
                            { name: 'Mã CK', href: '/stocks' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors relative group"
                            >
                                {item.name}
                                <motion.div
                                    className="absolute bottom-0 left-5 right-5 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                                />
                            </Link>
                        ))}

                        <Link href="/pricing" className="ml-2 group relative">
                            <Button variant="ghost" className="rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/10 flex items-center gap-2 font-black uppercase text-[11px] tracking-widest px-6 shadow-sm shadow-primary/10">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                Nâng cấp PRO
                            </Button>
                        </Link>
                    </div>

                    <div className="relative z-10">
                        {authButton}
                    </div>

                    {/* Bottom 3D Edge Highlight */}
                    <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-white opacity-60" />
                </motion.div>
            </div>
        </nav>
    )
}
