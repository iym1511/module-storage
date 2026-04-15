'use client';

import { type FC, useState } from 'react';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X,
  ArrowRight,
  TrendingUp,
  Package,
  Star,
  Plus,
  ChevronRight,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SuccessModal } from '@/components/ui/SuccessModal';

interface UiTestDashboardProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const UiTestDashboard: FC<UiTestDashboardProps> = ({ 
  user = { name: '홍길동', email: 'gildong@example.com' } 
}) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="theme-market flex flex-col min-h-screen bg-[#f1f1f1] text-[#111] selection:bg-[#2d4a43]/10 overflow-x-hidden">
      {/* --- High Density Header --- */}
      <header className="sticky top-0 z-[110] bg-white border-b border-[#ddd] shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tighter font-sans">MARKET ENGINE</h1>
            <nav className="hidden xl:flex items-center gap-6">
              <HeaderLink label="전체상품" active />
              <HeaderLink label="베스트" />
              <HeaderLink label="신상품" />
              <HeaderLink label="기획전" />
              <HeaderLink label="이벤트" />
            </nav>
          </div>
          
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="찾고 있는 상품이나 브랜드를 검색해 보세요" 
              className="w-full bg-[#f5f5f5] py-2 pl-10 pr-4 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-black/10"
            />
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button className="p-1.5 md:hidden"><Search size={20} /></button>
            <button className="flex flex-col items-center gap-0.5 group">
              <ShoppingBag size={20} strokeWidth={2} />
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-black">장바구니</span>
            </button>
            <div className="h-8 w-px bg-[#eee]" />
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <User size={16} />
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-[11px] font-bold">{user.name}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Lv. 멤버십</p>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)} className="xl:hidden p-1.5 bg-black text-white rounded-sm">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-6 space-y-6">
        {/* --- Dynamic Banner (Compact Hero) --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#2d4a43] rounded-sm p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <span className="bg-white/20 px-2 py-1 text-[10px] font-bold tracking-widest rounded-sm uppercase">Now Trending</span>
              <h2 className="text-3xl md:text-5xl font-sans font-black leading-tight tracking-tighter">
                Spring <span className="text-[#a8b5a5]">Intelligence</span> <br />
                Season Off 40%
              </h2>
              <Button 
                onClick={() => setIsSuccessModalOpen(true)}
                className="bg-white text-[#2d4a43] hover:bg-gray-100 h-10 px-6 rounded-sm font-bold text-xs"
              >
                쿠폰 받기
              </Button>
            </div>
            <ShoppingBag className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
          <div className="bg-white rounded-sm p-6 border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold mb-1">나의 쇼핑 리포트</h3>
              <p className="text-xs text-gray-400 leading-tight">최근 30일간의 구매 패턴을 분석했습니다.</p>
            </div>
            <div className="space-y-3 my-6">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">배송 중인 상품</span>
                <span className="font-bold">3개</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">적립 예정 포인트</span>
                <span className="font-bold text-blue-600">12,400P</span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-9 rounded-sm text-xs font-bold border-gray-300">
              상세보기
            </Button>
          </div>
        </section>

        {/* --- High Density Stats Grid --- */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <CompactStatItem label="전체 주문" value="48" trend="+2" />
          <CompactStatItem label="취소/반품" value="1" trend="-1" color="red" />
          <CompactStatItem label="리뷰 작성" value="12" trend="새로운 리뷰" color="blue" />
          <CompactStatItem label="찜한 상품" value="124" trend="품절임박 3" />
          <CompactStatItem label="쿠폰" value="5" trend="오늘만료 1" color="orange" />
          <CompactStatItem label="장바구니" value="8" trend="+3" />
        </section>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-4">
            <div className="bg-white rounded-sm border border-gray-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold">최근 활동 내역</h3>
                <button className="text-[11px] text-gray-400 font-bold hover:text-black">더보기</button>
              </div>
              <div className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-50 rounded-sm flex items-center justify-center text-gray-400 group-hover:bg-[#2d4a43] group-hover:text-white transition-colors">
                        <Package size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">주문번호 20260324-000{i} 배송이 시작되었습니다.</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">CJ대한통운 (운송장번호: 1234567890)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-gray-300">12:45</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-4">
            <div className="bg-black rounded-sm p-5 text-white flex items-center justify-between group cursor-pointer">
              <div>
                <h4 className="text-xs font-bold mb-1">멤버십 가입하고 혜택 받기</h4>
                <p className="text-[10px] text-gray-400">첫 구매 시 10,000원 즉시 할인</p>
              </div>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
            
            <div className="bg-white rounded-sm border border-gray-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold">인기 카테고리</h4>
                <Filter size={14} className="text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['아우터', '팬츠', '상의', '액세서리', '슈즈', '라이프스타일', '테크'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-gray-100 text-[10px] font-bold text-gray-600 rounded-full hover:bg-black hover:text-white cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-10">
        <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] font-bold text-gray-400">
          <div className="col-span-2 space-y-4">
            <h1 className="text-lg font-bold tracking-tighter text-black">MARKET ENGINE</h1>
            <p className="leading-relaxed max-w-sm">
              (주)마켓엔진 | 대표이사 홍길동 | 서울특별시 강남구 테헤란로 123
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-black">고객센터</h4>
            <p className="text-lg font-black tracking-tight text-black">1588-0000</p>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
          </div>
        </div>
      </footer>

      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} />
    </div>
  );
};

const HeaderLink = ({ label, active = false }: { label: string; active?: boolean }) => (
  <a href="#" className={cn(
    "text-[13px] font-bold transition-all",
    active ? "text-black border-b-2 border-black pb-1" : "text-gray-400 hover:text-black"
  )}>
    {label}
  </a>
);

const CompactStatItem = ({ label, value, trend, color = 'default' }: { label: string; value: string; trend: string; color?: 'red' | 'blue' | 'orange' | 'default' }) => {
  const colorMap: Record<'red' | 'blue' | 'orange' | 'default', string> = {
    red: "text-red-500",
    blue: "text-blue-600",
    orange: "text-orange-500",
    default: "text-gray-400"
  };

  return (
    <div className="bg-white p-4 rounded-sm border border-gray-200 hover:border-black transition-colors cursor-default">
      <p className="text-[10px] font-bold text-gray-400 mb-1">{label}</p>
      <div className="flex items-baseline justify-between">
        <h4 className="text-xl font-bold tracking-tight">{value}</h4>
        <span className={cn("text-[9px] font-bold", colorMap[color])}>{trend}</span>
      </div>
    </div>
  );
};
