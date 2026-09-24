import React from "react";

const STEPS = [
  {
    number: "01",
    title: "Search",
    description: "Choose a blood group and area.",
  },
  {
    number: "02",
    title: "Find",
    description: "Browse available and recently active donors.",
  },
  {
    number: "03",
    title: "Connect",
    description: "Call or message the donor directly.",
  },
];

const Finding_A_donor = () => {
  return (
    // ✅ No px here — padding lives on the inner container only
    <section className="w-full bg-[#faf4f0] py-16 sm:py-20">

      {/* ✅ Matches Hero container exactly */}
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.025em] text-[#1B1615] sm:text-[42px]">
          Finding a donor is simple.
        </h2>

        {/* ✅ Fixed: was text-2xl (too big) */}
        <p className="mt-2.5 text-[16.5px] leading-relaxed text-[#9E8E85]">
          Clear steps, current information, and direct contact when time matters.
        </p>

        {/* ── Divider + Steps ── */}
        <div className="mt-12 border-t border-[#E7E0DB]">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={[
                  "pt-8 pr-8",
                  i < STEPS.length - 1 ? "sm:border-r sm:border-[#E7E0DB]" : "",
                  i > 0                ? "sm:pl-8"                           : "",
                ].join(" ")}
              >
                {/* ✅ Fixed: was text-3xl (too big) */}
                <span className="text-[16px] font-bold tracking-wide text-[#E2484D]">
                  {step.number}
                </span>

                {/* ✅ Fixed: was text-3xl (too big) */}
                <h3 className="mt-3 text-[16px] font-bold text-[#1B1615]">
                  {step.title}
                </h3>

                {/* ✅ Fixed: text-1xl is not valid Tailwind */}
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-[#9E8E85]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Finding_A_donor;