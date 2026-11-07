export default function SkeletonLoader() {
  return (
    <div className="min-h-screen flex flex-col bg-main w-full">
      {/* Header falso */}
      <header className="w-full px-4 sm:px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div className="h-8 w-32 sm:w-48 skeleton-shimmer rounded-lg"></div>
        <div className="hidden md:flex gap-6">
          <div className="h-4 w-16 skeleton-shimmer rounded-md"></div>
          <div className="h-4 w-16 skeleton-shimmer rounded-md"></div>
          <div className="h-4 w-16 skeleton-shimmer rounded-md"></div>
          <div className="h-10 w-24 skeleton-shimmer rounded-full"></div>
        </div>
        <div className="md:hidden w-8 h-8 skeleton-shimmer rounded-md"></div>
      </header>

      <main className="flex-1">
        {/* Banner */}
        <div className="w-full h-[30vh] min-h-[200px] max-h-[250px] skeleton-shimmer"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Info del local */}
          <div className="relative -mt-16 sm:-mt-20 md:-mt-20 lg:-mt-24 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-[var(--bg-main)] skeleton-shimmer shrink-0"></div>
            <div className="mt-0 sm:mt-6 w-full max-w-sm">
              <div className="h-8 sm:h-12 w-3/4 skeleton-shimmer rounded-lg mb-3"></div>
              <div className="h-4 sm:h-5 w-1/2 skeleton-shimmer rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Servicios */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-0 pb-10 mb-10 md:mt-12">
          <div className="mb-10">
            <div className="h-10 sm:h-16 w-2/3 sm:w-1/3 skeleton-shimmer rounded-lg mb-3"></div>
            <div className="h-10 sm:h-16 w-1/2 sm:w-1/4 skeleton-shimmer rounded-lg"></div>
          </div>

          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-8 w-32 skeleton-shimmer rounded-lg"></div>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-end">
              <div className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden">
                <div className="w-full h-40 sm:h-52 skeleton-shimmer shrink-0"></div>
                <div className="p-4 sm:p-6 flex flex-col">
                  <div className="h-6 w-20 skeleton-shimmer rounded-full mb-3"></div>
                  <div className="h-7 w-3/4 skeleton-shimmer rounded-md mb-2"></div>
                  <div className="h-4 w-full skeleton-shimmer rounded-md mb-6"></div>
                  <div className="h-10 w-full skeleton-shimmer rounded-xl mt-4"></div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 sm:p-6 flex flex-col">
                  <div className="h-6 w-20 skeleton-shimmer rounded-full mb-3"></div>
                  <div className="h-7 w-3/4 skeleton-shimmer rounded-md mb-2"></div>
                  <div className="h-4 w-full skeleton-shimmer rounded-md mb-6"></div>
                  <div className="h-10 w-full skeleton-shimmer rounded-xl mt-4"></div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden hidden lg:flex">
                <div className="w-full h-40 sm:h-52 skeleton-shimmer shrink-0"></div>
                <div className="p-4 sm:p-6 flex flex-col">
                  <div className="h-6 w-20 skeleton-shimmer rounded-full mb-3"></div>
                  <div className="h-7 w-3/4 skeleton-shimmer rounded-md mb-2"></div>
                  <div className="h-4 w-full skeleton-shimmer rounded-md mb-6"></div>
                  <div className="h-10 w-full skeleton-shimmer rounded-xl mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
