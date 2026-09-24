import AvailableDonors from "./Components/Home/AvailableDonors/AvailableDonors";
import ChooseBloodGroup from "./Components/Home/ChooseBloodGroup/ChooseBloodGroup";
import Finding_A_donor from "./Components/Home/Finding_A_Donor/Finding_A_donor";
import Footer from "./Components/Footer/Footer";
import Hero from "./Components/Home/Hero/Hero";
import UserCounter from "./Components/Home/UserCounter/UserCounter";
import WhyUs from "./Components/Home/Why_BloodDonor/WhyUs";

export default function Home() {
  return (
   <>
   <Hero/>
   <UserCounter/>
   <Finding_A_donor/>
   <ChooseBloodGroup/>
   <AvailableDonors/>
   <WhyUs/>
   <Footer/>
   </>
  );
}
