import React from "react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/app/Assets/hero.png";
import { Button } from "@heroui/react";
import { HomeSearch } from "../SearchField/HomeSearch";

const Hero = () => {
  return (
    <section className="bg-[#FDF9F6]">
      {/* Same container alignment as Navbar */}
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div
          className="
            grid
            min-h-[600px]
            w-full
            items-center
            gap-12
            py-14
            sm:py-16
            lg:min-h-[680px]
            lg:grid-cols-2
            lg:gap-16
            lg:py-20
          "
        >
          {/* ================= LEFT CONTENT ================= */}
          <div className="w-full">
            {/* Badge */}
            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#E2484D]/10
                bg-[#FFE8E8]
                px-4
                py-2
                text-sm
                font-semibold
                text-[#E2484D]
              "
            >
              <span className="h-2 w-2 rounded-full bg-[#E2484D]" />
              Dhaka&apos;s donor community
            </div>

            {/* Heading */}
            <h1
              className="
                text-5xl
                font-extrabold
                leading-[1.02]
                tracking-[-0.035em]
                text-[#1B1615]
                sm:text-6xl
                lg:text-7xl
              "
            >
              Find Blood.
              <span
                className="
                  mt-2
                  block
                  bg-gradient-to-r
                  from-[#E2484D]
                  via-[#D83E43]
                  to-[#B92F35]
                  bg-clip-text
                  text-transparent
                "
              >
                Find Hope.
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mt-7
                max-w-xl
                font-Manrope
                text-base
                leading-7
                text-[#68625E]
                sm:text-2xl
                sm:leading-8
              "
            >
              Connect with active blood donors across Dhaka when every moment
              matters. Find the right donor faster and help make a life-saving
              difference.
            </p>

            {/* Buttons */}
            <div
              className="
                mt-9
                flex
                w-full
                flex-col
                gap-3
                sm:w-auto
                sm:flex-row
              "
            >
              {/* Find Donor */}
              <Link href="/Find_A_Doner" className="w-full sm:w-auto">
                <Button
                  className="
                    h-12
                    w-full
                    min-w-[170px]
                    rounded-xl
                    border
                    border-[#E2484D]
                    bg-[#E2484D]
                    px-6
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_8px_24px_rgba(226,72,77,0.20)]
                    transition-all
                    duration-300
                    ease-out

                    hover:-translate-y-0.5
                    hover:bg-[#D83E43]
                    hover:shadow-[0_12px_28px_rgba(226,72,77,0.28)]

                    active:translate-y-0
                    active:scale-[0.98]
                  "
                >
                  Find a Donor
                  <span className="ml-1 text-base">→</span>
                </Button>
              </Link>

              {/* Become Donor */}
              <Link href="/Become_A_Donor" className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  className="
                    h-12
                    w-full
                    min-w-[170px]
                    rounded-xl
                    border
                    border-[#1B1615]/10
                    bg-white/60
                    px-6
                    text-sm
                    font-semibold
                    text-[#1B1615]
                    shadow-sm
                    transition-all
                    duration-300
                    ease-out

                    hover:-translate-y-0.5
                    hover:border-[#E2484D]/20
                    hover:bg-[#FFE8E8]
                    hover:text-[#E2484D]

                    active:translate-y-0
                    active:scale-[0.98]
                  "
                >
                  Become a Donor
                </Button>
              </Link>
            </div>

            {/* Community */}
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-9 w-9 rounded-full border-2 border-[#FDF9F6] bg-[#FFD6D8]" />
                <div className="h-9 w-9 rounded-full border-2 border-[#FDF9F6] bg-[#F5B8BB]" />
                <div className="h-9 w-9 rounded-full border-2 border-[#FDF9F6] bg-[#E9878B]" />
              </div>

              <p className="text-md text-[#68625E]">
              
                  Local donors
                
                ready to help when it matters most
              </p>
            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="w-full">
            <div
              className="
      group
      relative
      w-full
      overflow-visible
    "
            >
              <Image
                src={heroImage}
                alt="Blood donation community"
                width={800}
                height={550}
                priority
                className="
        h-auto
        w-full
        object-contain
        transition-transform
        duration-700
        ease-out
        group-hover:scale-[1.015]
      "
              />
            </div>
          </div>
        </div>
      </div>

      
      <div className="container mx-auto w-full pb-15">
  <HomeSearch />
</div>


    </section>
  );
};

export default Hero;
