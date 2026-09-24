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
    <section className="w-full bg-[#faf4f0] px-6 py-16 sm:px-10 lg:px-16">
      <div className="container mx-auto  px-6">

        {/* ── Heading ── */}
        <h2 className="text-[34px] font-extrabold leading-tight tracking-[-0.025em] text-[#1B1615] sm:text-6xl">
          Finding a donor is simple.
        </h2>
        <p className="mt-2.5 text-2xl leading-relaxed text-[#9E8E85]">
          Clear steps, current information, and direct contact when time matters.
        </p>

        {/* ── Divider + Steps ── */}
        <div className="mt-12 border-t border-[#E7E0DB]">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={[
                  "pt-8 pr-8 ",
                  i < STEPS.length - 1 ? "sm:border-r sm:border-[#E7E0DB]" : "",
                  i > 0               ? "sm:pl-8"                           : "",
                ].join(" ")}
              >
                {/* Step number */}
                <span className="text-3xl font-bold tracking-wide text-[#E2484D]">
                  {step.number}
                </span>

                {/* Title */}
                <h3 className="mt-3 text-3xl font-bold text-[#1B1615]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-1xl leading-relaxed text-[#9E8E85]">
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