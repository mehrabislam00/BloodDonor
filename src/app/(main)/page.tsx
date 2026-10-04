import Finding_A_donor from "@/components/home/FindingADonor";
import Hero from "@/components/home/Hero";
import HomeDonorSection from "@/components/home/HomeDonorSection";
import UserCounter from "@/components/home/UserCounter";
import WhyUs from "@/components/home/WhyUs";
import { getPublicDonorCards } from "@/lib/public-donors";

export default async function Home() {
  const donors = await getPublicDonorCards();

  return (
   <>
   <Hero/>
   <UserCounter/>
   <Finding_A_donor/>
   <HomeDonorSection donors={donors} />
   <WhyUs/>
   </>
  );
}
