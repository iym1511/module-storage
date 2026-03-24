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
  Plus
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
    <div className="theme-market flex flex-col min-h-screen bg-[#fdfcfb] text-[#1a1a1a] selection:bg-[#2d4a43]/10 overflow-x-hidden">
      {/* --- Header --- */}
      <header className="sticky top-0 z-[100] bg-[#fdfcfb] border-b border-[#eee]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight">MARKET.</h1>
            <nav className="hidden md:flex items-center gap-8">
              <HeaderLink label="Shop All" active />
              <HeaderLink label="New Arrivals" />
              <HeaderLink label="Editorial" />
            </nav>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            <button className="p-2 hover:text-[#2d4a43] transition-colors"><Search size={20} strokeWidth={1.5} /></button>
            <button className="p-2 hover:text-[#2d4a43] transition-colors relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#2d4a43] rounded-full" />
            </button>
            <div className="hidden md:block h-4 w-px bg-[#eee]" />
            
            {/* Desktop Profile */}
            <div className="hidden md:flex items-center gap-3 group cursor-pointer pl-2">
              <span className="text-sm font-semibold">{user.name}</span>
              <div className="w-8 h-8 rounded-full bg-[#f3f1ee] flex items-center justify-center border border-[#e5e1dc] overflow-hidden">
                <User size={16} strokeWidth={1.5} />
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-[#f3f1ee] transition-colors rounded-full"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* --- Mobile Full-Screen Menu: Absolute Solid Background --- */}
        <div className={cn(
          "fixed inset-0 bg-[#fdfcfb] z-[200] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Menu Header (Fixed at Top) */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#eee] bg-[#fdfcfb]">
            <h1 className="text-xl font-serif font-bold text-[#1a1a1a]">MARKET.</h1>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-[#f3f1ee] transition-colors rounded-full"
            >
              <X size={24} className="text-[#1a1a1a]" />
            </button>
          </div>

          {/* Vertical Menu Items (No Scroll, Clear Hierarchy) */}
          <nav className="flex-1 flex flex-col p-10 gap-10 bg-[#fdfcfb]">
            <MobileNavLink label="Shop All" active />
            <MobileNavLink label="New Arrivals" />
            <MobileNavLink label="Collections" />
            <MobileNavLink label="Editorial" />
            <MobileNavLink label="My Account" />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 md:space-y-10 animate-fade-up order-last lg:order-first">
              <p className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.3em] text-[#2d4a43]">Insights for {user.name}</p>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-[1.1] tracking-tight break-keep text-[#1a1a1a]">
                Curated <br className="hidden sm:block" />
                Market <span className="italic font-normal">Intelligence</span>
              </h2>
              <p className="text-base md:text-lg text-[#444] leading-relaxed max-w-xl">
                당신만을 위해 엄선된 마켓 트렌드와 쇼핑 인사이트를 확인하세요. 
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Button 
                  onClick={() => setIsSuccessModalOpen(true)}
                  className="bg-[#2d4a43] hover:bg-[#1e332c] text-white px-8 h-14 rounded-none font-bold tracking-wide transition-all"
                >
                  Explore Trends <ArrowRight className="ml-2" size={18} />
                </Button>
                <Button variant="ghost" className="h-14 px-8 rounded-none border border-[#2d4a43] font-bold hover:bg-[#2d4a43]/5">
                  View Orders
                </Button>
              </div>
            </div>
            
            <div className="relative h-[300px] sm:h-[400px] lg:h-[550px] bg-[#f3f1ee] overflow-hidden order-first lg:order-last">
              <div className="absolute inset-0 flex items-center justify-center text-[#e5e1dc]">
                <ShoppingBag className="w-[120px] h-[120px] md:w-[200px] md:h-[200px]" strokeWidth={0.5} opacity={0.3} />
              </div>
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 p-6 md:p-8 lg:p-10 bg-white shadow-sm border border-white/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#2d4a43] mb-1">Featured Item</p>
                <p className="font-serif text-xl lg:text-2xl italic leading-none whitespace-nowrap text-[#1a1a1a]">The Sage Collection</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="bg-white border-y border-[#eee] py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20">
              <StatItem label="Active Users" value="1.2k" trend="+12%" />
              <StatItem label="Conversion" value="3.4%" trend="+0.5%" />
              <StatItem label="Avg. Order" value="$124" trend="Stable" />
              <StatItem label="CS Score" value="4.9/5" trend="+0.1" />
            </div>
          </div>
        </section>

        {/* List Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 space-y-12 md:space-y-20">
          <div className="flex items-end justify-between border-b border-[#eee] pb-6 md:pb-10">
            <h3 className="text-2xl md:text-4xl font-serif text-[#1a1a1a]">Recent Intelligence</h3>
            <button className="text-xs md:text-sm font-bold border-b-2 border-[#2d4a43] pb-1">View All</button>
          </div>
          
          <div className="grid gap-10 md:gap-14">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 md:pb-14 border-b border-[#f3f1ee] last:border-0 hover:translate-x-1 transition-transform duration-500">
                <div className="flex items-center gap-6 md:gap-10">
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-[#f3f1ee] flex items-center justify-center shrink-0 group-hover:bg-[#2d4a43] group-hover:text-white transition-colors duration-500">
                    {i === 1 ? (
                      <TrendingUp className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                    ) : i === 2 ? (
                      <Package className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                    ) : (
                      <Star className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-1">Market Report 0{i}</p>
                    <p className="text-lg md:text-2xl font-serif leading-tight truncate md:whitespace-normal text-[#1a1a1a]">2026 Spring Summer Trend Analysis</p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-16 mt-2 md:mt-0">
                  <div className="md:text-right shrink-0">
                    <p className="text-[10px] font-bold text-[#999] mb-1">Status</p>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1a1a1a]">Processed</p>
                  </div>
                  <ArrowRight className="text-[#ccc] md:text-[#eee] group-hover:text-[#2d4a43] transition-colors duration-500" size={28} strokeWidth={1} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto w-full px-6 md:px-10 py-12 md:py-16 border-t border-[#eee] flex flex-col md:flex-row justify-between items-center gap-10 text-[#999]">
        <p className="text-[10px] font-bold tracking-widest uppercase">© 2026 Market Intelligence Co.</p>
        <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase">
          <a href="#" className="hover:text-[#1a1a1a]">Privacy</a>
          <a href="#" className="hover:text-[#1a1a1a]">Terms</a>
          <a href="#" className="hover:text-[#1a1a1a]">Support</a>
        </div>
      </footer>

      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} />
    </div>
  );
};

const HeaderLink = ({ label, active = false }: { label: string; active?: boolean }) => (
  <a href="#" className={cn(
    "text-xs font-bold uppercase tracking-[0.2em] transition-all",
    active ? "text-[#1a1a1a] border-b-2 border-[#2d4a43] pb-1" : "text-[#999] hover:text-[#1a1a1a]"
  )}>
    {label}
  </a>
);

const MobileNavLink = ({ label, active = false }: { label: string; active?: boolean }) => (
  <a href="#" className={cn(
    "text-4xl font-serif transition-all block",
    active ? "text-[#2d4a43] underline underline-offset-8 decoration-1" : "text-[#1a1a1a]"
  )}>
    {label}
  </a>
);

const StatItem = ({ label, value, trend }: { label: string; value: string; trend: string }) => (
  <div className="space-y-4">
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#999]">{label}</p>
    <div className="flex items-baseline gap-3">
      <h4 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">{value}</h4>
      <span className="text-[9px] font-bold text-[#2d4a43] bg-[#2d4a43]/5 px-1.5 py-0.5 rounded-full">{trend}</span>
    </div>
  </div>
);
