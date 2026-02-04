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
    const [isOpen, setIsOpen] = useState(false)

    const navLinks = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Bài viết', href: '/blog' },
        { name: 'Sách hay', href: '/books' },
        { name: 'Mã CK', href: '/stocks' },
    ]

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

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-1 relative z-10">
                        {navLinks.map((item) => (
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

                    <div className="flex items-center gap-2 relative z-10">
                        <div className="hidden md:block">
                            {authButton}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-slate-600 hover:bg-stone-200 transition-colors"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Bottom 3D Edge Highlight */}
                    <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-white opacity-60" />
                </motion.div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-[32px] border border-stone-200/50 shadow-2xl p-6 lg:hidden z-40 overflow-hidden"
                        >
                            <div className="flex flex-col gap-2">
                                {navLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="px-6 py-4 text-lg font-black text-slate-900 hover:bg-stone-50 rounded-2xl transition-colors flex items-center justify-between group"
                                    >
                                        {item.name}
                                        <div className="w-8 h-[2px] bg-slate-200 group-hover:w-12 group-hover:bg-primary transition-all" />
                                    </Link>
                                ))}

                                <div className="h-[1px] bg-stone-100 my-2" />

                                <Link
                                    href="/pricing"
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-4 flex items-center justify-between bg-primary/5 rounded-2xl text-primary font-black uppercase text-sm tracking-widest hover:bg-primary hover:text-white transition-all"
                                >
                                    Nâng cấp tài khoản PRO
                                    <Star className="h-4 w-4 fill-current" />
                                </Link>

                                <div className="mt-4 flex justify-center">
                                    {authButton}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}
