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
                    className="bg-stone-50/95 backdrop-blur-xl border border-stone-200/50 rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.08),0_10px_15px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col"
                >
                    {/* Soft Light Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

                    {/* Top Row: Logo & Auth */}
                    <div className="h-16 md:h-20 flex items-center justify-between px-6 md:px-8 relative z-10 w-full">
                        <Link href="/" className="flex items-center group transition-transform hover:scale-105 active:scale-95 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/logo.png"
                                alt="Tinh Hoa Đầu Tư Logo"
                                className="h-7 md:h-10 w-auto object-contain"
                            />
                        </Link>

                        <div className="flex items-center gap-2">
                            <div className="scale-90 md:scale-100 origin-right">
                                {authButton}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Fully Present Links (Visible on all screens with scroll on small) */}
                    <div className="border-t border-stone-100/50 bg-stone-50/50 relative z-10">
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-4 py-2 md:py-3 justify-start sm:justify-center">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-4 md:px-6 py-1.5 md:py-2 text-[11px] md:text-sm font-black text-slate-500 hover:text-primary transition-colors whitespace-nowrap uppercase tracking-widest relative group"
                                >
                                    {item.name}
                                    <motion.div
                                        className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                                    />
                                </Link>
                            ))}

                            <Link href="/pricing" className="shrink-0 ml-2">
                                <Button variant="ghost" className="rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/10 flex items-center gap-2 font-black uppercase text-[9px] md:text-[11px] tracking-widest px-4 md:px-6 h-7 md:h-10">
                                    <Star className="h-3 w-3 md:h-3.5 md:w-3.5 fill-current" />
                                    V.I.P
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Bottom 3D Edge Highlight */}
                    <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-white opacity-60" />
                </motion.div>
            </div>
        </nav>
    )
}
