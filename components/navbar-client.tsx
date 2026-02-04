'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Star, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'

interface NavbarClientProps {
    authButton: React.ReactNode
}

export function NavbarClient({ authButton }: NavbarClientProps) {
    const navLinks = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Bài viết', href: '/blog' },
        { name: 'Sách hay', href: '/books' },
        { name: 'Mã CK', href: '/stocks' },
    ]

    return (
        <nav className="sticky top-4 z-50 px-2 sm:px-4 mb-4 mt-2">
            <div className="container mx-auto">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-stone-50/95 backdrop-blur-xl border border-stone-200/50 rounded-[28px] md:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.08),0_10px_15px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col lg:flex-row lg:items-center lg:justify-between lg:h-20 lg:max-w-6xl lg:mx-auto"
                >
                    {/* Soft Light Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

                    {/* Top Row (Mobile) / Left Side (Desktop) */}
                    <div className="h-16 lg:h-full flex items-center justify-between px-6 lg:pl-10 lg:pr-0 relative z-10 lg:shrink-0">
                        <Link href="/" className="flex items-center group transition-transform hover:scale-105 active:scale-95 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/logo.png"
                                alt="Tinh Hoa Đầu Tư Logo"
                                className="h-7 md:h-10 w-auto object-contain"
                            />
                        </Link>

                        {/* Mobile Auth (Hidden on Desktop) */}
                        <div className="lg:hidden scale-90 origin-right">
                            {authButton}
                        </div>
                    </div>

                    {/* Links Section: Bottom Row (Mobile) / Center (Desktop) */}
                    <div className="border-t lg:border-t-0 border-stone-100/50 bg-stone-50/50 lg:bg-transparent relative z-10 flex-1 lg:flex lg:justify-center">
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-4 py-2 lg:p-0 justify-start sm:justify-center lg:gap-2">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-4 lg:px-5 py-1.5 lg:py-2 text-[11px] lg:text-[13px] font-black text-slate-500 hover:text-primary transition-colors whitespace-nowrap uppercase tracking-widest relative group"
                                >
                                    {item.name}
                                    <motion.div
                                        className="absolute bottom-0 left-4 lg:left-5 right-4 lg:right-5 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                                    />
                                </Link>
                            ))}

                            {/* Desktop VIP (Hidden on Mobile) */}
                            <Link href="/pricing" className="hidden lg:block ml-2 group relative">
                                <Button variant="ghost" className="rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/10 flex items-center gap-2 font-black uppercase text-[11px] tracking-widest px-6 h-10 shadow-sm shadow-primary/5">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    VIP
                                </Button>
                            </Link>

                            {/* Mobile VIP (Hidden on Desktop) */}
                            <Link href="/pricing" className="lg:hidden shrink-0 ml-2">
                                <Button variant="ghost" className="rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/10 flex items-center gap-2 font-black uppercase text-[9px] tracking-widest px-4 h-7">
                                    <Star className="h-3 w-3 fill-current" />
                                    VIP
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Auth (Right Side, Hidden on Mobile) */}
                    <div className="hidden lg:flex items-center pr-10 relative z-10 shrink-0">
                        <div className="h-10 border-l border-stone-200 mx-6 mr-8 opacity-50" />
                        {authButton}
                    </div>

                    {/* Bottom Edge Highlight */}
                    <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-white opacity-60" />
                </motion.div>
            </div>
        </nav>
    )
}
