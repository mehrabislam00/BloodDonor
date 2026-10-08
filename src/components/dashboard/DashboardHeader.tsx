interface Props { greeting: string; }

export function DashboardHeader({ greeting }: Props) {
  return (
    <section className="border-b border-[#EDE7E2] bg-[#faf4f0]">
      <div className="container mx-auto w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.18em] text-[#E2484D] pl-1">
          Your Dashboard
        </p>
        <h1 className="text-[38px] font-extrabold leading-[1.04] tracking-[-0.03em] text-[#1B1615] sm:text-[52px]">
          {greeting}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#9E8E85]">
          Manage your donor information and availability.
          
          
        </p>
      </div>
    </section>
  );
}