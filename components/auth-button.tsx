import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { signOut } from "@/app/auth/actions";

export default async function AuthButton() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = user ? await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() : { data: null };

    return user ? (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-bold uppercase tracking-tighter">
                <UserCircle className="h-4 w-4 text-primary" />
                <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
            </div>
            {profile?.role === 'admin' && (
                <Button variant="ghost" size="sm" asChild className="text-slate-700 hover:bg-slate-100 rounded-full h-8 px-4 text-[11px] font-black uppercase tracking-widest border border-slate-200">
                    <Link href="/admin">Admin</Link>
                </Button>
            )}
            <form action={signOut}>
                <Button variant="outline" size="sm" className="bg-transparent text-slate-800 border-slate-200 hover:bg-slate-50 rounded-full h-8 px-4 text-[11px] font-black uppercase tracking-widest transition-all">
                    Thoát
                </Button>
            </form>
        </div>
    ) : (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-slate-600 font-bold hover:bg-slate-100 rounded-full px-4 border-none">
                <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-6 font-black uppercase text-[10px] tracking-widest shadow-md shadow-primary/20">
                <Link href="/signup">Tham gia</Link>
            </Button>
        </div>
    );
}
