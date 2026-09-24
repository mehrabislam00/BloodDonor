import React from "react";
import { Heart, Lock, Zap, ShieldCheck, Users } from "lucide-react";
import DonorForm from "../Components/Become_A_Donor/DonorForm";
import Footer from "../Components/Footer/Footer";


const TRUST_POINTS = [
  { icon: Zap,         text: "Takes less than 2 minutes to set up"          },
  { icon: ShieldCheck, text: "Contact only shown to verified users"          },
  { icon: Users,       text: "1,200+ donors already in the community"        },
];

const Become_A_Donor = () => {
  return (
    <>
     <section className="relative min-h-screen w-full overflow-hidden bg-[#FAF7F4] py-16 sm:py-20">

      {/* ── Decorative background ── */}
    
      <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">

          {/* ── LEFT: static copy (server-rendered) ── */}
          <div className="w-full">

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E2484D]/15 bg-[#FFE8E8] px-4 py-2 text-[12px] font-semibold text-[#E2484D]">
              <Heart size={13} strokeWidth={2.5} fill="currentColor" />
              Join the community
            </div>

            {/* Heading */}
            <h1 className="text-[52px] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#1B1615] sm:text-[64px]">
              Become a<br />
              <span className="bg-gradient-to-r from-[#E2484D] via-[#D83E43] to-[#B92F35] bg-clip-text text-transparent">
                donor.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-sm text-[14.5px] leading-7 text-[#68625E]">
              Keep your{" "}
              <span className="font-semibold text-[#1B1615]">information updated</span>{" "}
              so people nearby can{" "}
              <span className="font-semibold text-[#1B1615]">find you</span>{" "}
              when they need blood.
            </p>

            {/* Privacy note */}
            <div className="mt-7 flex items-center gap-3 rounded-[12px] border border-[#E2484D]/15 bg-[#FFE8E8] px-4 py-3">
              <Lock size={14} strokeWidth={2} className="shrink-0 text-[#E2484D]" />
              <p className="text-[12.5px] font-medium text-[#E2484D]">
                Your exact address will never be shown publicly.
              </p>
            </div>

            {/* Trust points */}
            <div className="mt-10 flex flex-col gap-3">
              {TRUST_POINTS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-[13px] text-[#68625E]">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFE4E4] text-[#E2484D]">
                    <Icon size={13} strokeWidth={2.5} />
                  </div>
                  {text}
                </div>
              ))}
            </div>

          </div>

          {/* ── RIGHT: interactive form (client component) ── */}
          <DonorForm />

        </div>
      </div>
    </section>
 <Footer/>
    </>
   
    
  );
};

export default Become_A_Donor;