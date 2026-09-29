import AvailableDonors from "@/components/home/AvailableDonors";
import ChooseBloodGroup from "@/components/home/ChooseBloodGroup";
import Finding_A_donor from "@/components/home/FindingADonor";
import Hero from "@/components/home/Hero";
import UserCounter from "@/components/home/UserCounter";
import WhyUs from "@/components/home/WhyUs";

export default function Home() {
  return (
   <>
   <Hero/>
   <UserCounter/>
   <Finding_A_donor/>
   <ChooseBloodGroup/>
   <AvailableDonors/>
   <WhyUs/>
   </>
  );
}
