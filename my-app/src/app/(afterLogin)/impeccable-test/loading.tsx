'use client';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfcfb] overflow-hidden">
      {/* Editorial Header Skeleton */}
      <header className="border-b border-[#eee] bg-[#fdfcfb]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="h-6 w-24 bg-[#f3f1ee] animate-pulse" />
            <div className="hidden md:flex gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-16 bg-[#f3f1ee] animate-pulse" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-8 w-8 bg-[#f3f1ee] animate-pulse" />
            <div className="h-8 w-8 bg-[#f3f1ee] animate-pulse" />
            <div className="h-4 w-px bg-[#eee]" />
            <div className="h-8 w-20 bg-[#f3f1ee] animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="h-4 w-32 bg-[#f3f1ee] animate-pulse" />
              <div className="space-y-4">
                <div className="h-16 w-full max-w-sm bg-[#f3f1ee] animate-pulse" />
                <div className="h-16 w-3/4 bg-[#f3f1ee] animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-[#f3f1ee] animate-pulse" />
                <div className="h-4 w-5/6 bg-[#f3f1ee] animate-pulse" />
              </div>
              <div className="flex gap-4 pt-4">
                <div className="h-14 w-40 bg-[#f3f1ee] animate-pulse" />
                <div className="h-14 w-40 bg-[#f3f1ee] animate-pulse" />
              </div>
            </div>
            <div className="hidden md:block h-[500px] bg-[#f3f1ee] animate-pulse" />
          </div>
        </section>

        {/* Stats Strip Skeleton */}
        <section className="border-y border-[#eee] py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-3 w-20 bg-[#f3f1ee] animate-pulse" />
                  <div className="h-10 w-24 bg-[#f3f1ee] animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* List Section Skeleton */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 space-y-16">
          <div className="flex justify-between border-b border-[#eee] pb-8">
            <div className="h-8 w-48 bg-[#f3f1ee] animate-pulse" />
            <div className="h-4 w-16 bg-[#f3f1ee] animate-pulse" />
          </div>
          
          <div className="grid gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-[#f3f1ee]">
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="w-16 h-16 bg-[#f3f1ee] animate-pulse shrink-0" />
                  <div className="space-y-2 w-full md:w-64">
                    <div className="h-3 w-20 bg-[#f3f1ee] animate-pulse" />
                    <div className="h-6 w-full bg-[#f3f1ee] animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-12">
                  <div className="h-8 w-24 bg-[#f3f1ee] animate-pulse" />
                  <div className="h-6 w-6 bg-[#f3f1ee] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
