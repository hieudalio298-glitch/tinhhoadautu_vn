
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Target, Users, Award } from "lucide-react"
import { createClient } from '@/utils/supabase/server'

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

export default async function AboutPage() {
    const supabase = await createClient()
    const aboutStory = await getSetting(supabase, 'about_story')

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 italic">
                    Về <span className="text-primary italic">StockBlog.vn</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Sứ mệnh của chúng tôi là mang lại những góc nhìn chuyên sâu, dữ liệu trung thực giúp nhà đầu tư cá nhân thành công trên thị trường tài chính Việt Nam.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Câu chuyện của chúng tôi</h2>
                    {aboutStory ? (
                        <div className="space-y-4 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {aboutStory}
                        </div>
                    ) : (
                        <>
                            <p className="text-muted-foreground leading-relaxed">
                                Được thành lập bởi đội ngũ chuyên gia phân tích tài chính và nhà đầu tư dày dạn kinh nghiệm, StockBlog ra đời trong bối cảnh thị trường chứng khoán Việt Nam đang bùng nổ nhưng thiếu hụt những nguồn tin cậy, không bị chi phối bởi các nhóm lợi ích.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Chúng tôi tin rằng kiến thức đúng đắn và dữ liệu chuẩn xác là "vũ khí" duy nhất giúp nhà đầu tư tồn tại và kiếm lời bền vững.
                            </p>
                        </>
                    )}
                </div>
                <div className="bg-primary/5 rounded-3xl p-8 aspect-video flex items-center justify-center border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <Target className="h-24 w-24 text-primary opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-primary/40 text-sm italic">
                        "Kiến thức tạo nên thịnh vượng"
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                {[
                    { icon: ShieldCheck, title: "Uy tín", desc: "Thông tin được kiểm chứng đa chiều trước khi đăng tải." },
                    { icon: Target, title: "Chính xác", desc: "Dữ liệu tài chính cập nhật từ nguồn chuẩn quốc tế." },
                    { icon: Users, title: "Cộng đồng", desc: "Nơi kết nối các nhà đầu tư thông thái." },
                    { icon: Award, title: "Chuyên sâu", desc: "Phân tích doanh nghiệp thực thụ, không theo trào lưu." }
                ].map((item, i) => (
                    <Card key={i} className="border-none shadow-none bg-muted/30 hover:bg-muted/50 transition-colors rounded-2xl">
                        <CardContent className="pt-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white text-center shadow-2xl shadow-slate-200">
                <h2 className="text-3xl font-bold mb-6">Bạn đã sẵn sàng nâng tầm kỹ năng đầu tư?</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Tham gia cùng hơn 10.000+ nhà đầu tư đang nhận bản tin phân tích độc quyền mỗi tuần.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-10 py-4 bg-primary rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        Bắt đầu ngay
                    </button>
                    <button className="px-10 py-4 bg-slate-800 rounded-xl font-bold hover:bg-slate-750 transition-all border border-slate-700">
                        Liên hệ hợp tác
                    </button>
                </div>
            </div>
        </div>
    )
}
